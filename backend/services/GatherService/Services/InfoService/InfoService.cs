using AutoMapper;
using Gather.Client;
using Gather.Data;
using Microsoft.EntityFrameworkCore;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Models;
using System.Globalization;
using System.Net.WebSockets;
using TL;

namespace Gather.Services.InfoService;

public class InfoService(GatherClient client, DataContext context, IMapper mapper, ILogger<InfoService> logger) : IInfoService
{
    // Дата, с которой начинаем загружать данные.
    private readonly DateTime startLoadingDate = DateTime.Parse("Jan 25, 2025");
    readonly ILogger _logger = logger;
    readonly GatherClient _client = client;
    TL.User? user;
    private readonly IMapper _mapper = mapper;
    private readonly DataContext _context = context;
    readonly Object lockObject = new();
    static bool updateChannelsEnable = true;

    public async Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels()
    {
        var response = new ServiceResponse<IEnumerable<ChannelDto>>();

        if (_context.Channels == null)
        {
            _logger.LogError("GetAllChannels, _context.Channels is null");
            response.Success = false;
            response.Message = "Internal server error";
            response.Data = [];
            return response;
        }

        try
        {
            var chats = await _context.Channels.ToListAsync();
            var results = _mapper.Map<List<ChannelDto>>(chats);
            response.Data = results;

            //_logger.LogDebug($"We are logged-in as {user.Username ?? user.Username} (id {user.Id})");

            //var chats = await _client.Messages_GetAllChats(); // chats = groups/channels (does not include users dialogs)
            //_logger.LogDebug("This user has joined the following:");
            //foreach (var (id, chat) in chats.chats)
            //    result.Add(chat);
            //switch (chat)
            //{
            //case Chat smallgroup when smallgroup.IsActive:
            //    _logger.LogDebug($"{id}:  Small group: {smallgroup.title} with {smallgroup.participants_count} members");
            //    break;
            //case Channel channel when channel.IsChannel:
            //    _logger.LogDebug($"{id}: Channel {channel.username}: {channel.title}");
            //    break;
            //case Channel group: // no broadcast flag => it's a big group, also called supergroup or megagroup
            //    _logger.LogDebug($"{id}: Group {group.username}: {group.title}");
            //    break;
            //}
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "GetAllChannels");
            response.Success = false;
            response.Message = "An error has occurred while getting all channels." +
                Environment.NewLine +
                exception.Message;
            response.Data = [];
        }

        return response;
    }

    public async Task<ServiceResponse<IEnumerable<long>>> UpdateChannels()
    {
        var response = new ServiceResponse<IEnumerable<long>>();
        if (_context.Users == null
            || _context.Channels == null
            || _context.Accounts == null)
        {
            response.Success = false;
            response.Message = "Internal server error";
            return response;
        }

        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception,
                "UpdateChannels" +
                Environment.NewLine +
                "The error while logging telegram user.");

            response.Success = false;
            response.Message = "Unable to login to Telegram";
            response.Data = [];
            return response;
        }

        if (!updateChannelsEnable)
        {
            response.Data = [];
            response.Success = false;
            response.Message = "Channels updates are temporarily unavailable";
            return response;
        }
        else
        {
            lock (lockObject)
            {
                updateChannelsEnable = false;
            }
        }

        try
        {
            // chats = groups/channels (does not include users dialogs)
            var chats = await _client.Messages_GetAllChats();
            var chatsFromTG = new List<ChatBase>();
            foreach (var (id, chat) in chats.chats)
            {
                chatsFromTG.Add(chat);
            }

            // Удаляем из БД те, которых в телеграмме уже нет.
            var channelInDB = await _context.Channels.ToListAsync();
            foreach (var chat in channelInDB)
            {
                if (!chatsFromTG.Any(channel => channel.ID == chat.Id))
                {
                    _context.Channels.Remove(chat);
                }
            }
            await _context.SaveChangesAsync();

            // Добавляем новые в БД.
            var random = new Random();
            _logger.LogInformation("Channels update is started");
            int channelCount = 0;
            //foreach (var chat in chatsFromTG)
            for (int i = 0; i < chatsFromTG.Count; i++)
            {
                try
                {
                    if (chatsFromTG[i].IsChannel)
                    {
                        var isChannelExistsInDb =
                            await _context.Channels
                            .AnyAsync(channel => channel.Id == chatsFromTG[i].ID);

                        if (!isChannelExistsInDb)
                        {
                            var addedChat = _mapper.Map<SharedCore.Models.Channel>(chatsFromTG[i]);
                            var channelFullInfo = await _client.GetFullChat(chatsFromTG[i]);


                            //addedChat.Owner = channelFullInfo.
                            addedChat.About = channelFullInfo.full_chat.About;
                            addedChat.ParticipantsCount = channelFullInfo.full_chat.ParticipantsCount;

                            if (chatsFromTG[i].Photo != null)
                            {
                                MemoryStream ms = new(1000000);
                                Storage_FileType storage = await _client.DownloadProfilePhotoAsync(chatsFromTG[i], ms);
                                addedChat.Image = Convert.ToBase64String(ms.ToArray());
                            }

                            if (channelFullInfo.users.Count > 0)
                            {
                                var userKey = channelFullInfo.users.First().Key;
                                var owner = await _context.Accounts
                                    .Where(acc => acc.Id == userKey)
                                    .FirstOrDefaultAsync();

                                if (owner == null)
                                {
                                    owner = _mapper.Map<Account>(channelFullInfo.users[userKey]);
                                    _context.Accounts.Add(owner);
                                    _context.SaveChanges();
                                }

                                addedChat.Owner = owner;
                            }

                            _context.Channels.Add(addedChat);
                            await _context.SaveChangesAsync();

                            channelCount++;
                            _logger.LogInformation($"Channel {channelCount} added to collection: {addedChat.Title}");
                            if (channelCount > 30)
                            {
                                break;
                            }
                        }
                    }
                    else if (chatsFromTG[i].IsGroup)
                    { }
                    else
                    {
                        _logger.LogWarning("Chat neither char not channel");
                    }

                }
                catch (Exception exception)
                {
                    _logger.LogError(
                        exception.Message + Environment.NewLine +
                        exception.StackTrace + Environment.NewLine +
                        $"channel is: {chatsFromTG[i].Title}", "UpdateChannels");
                }
                Thread.Sleep(random.Next(500, 2000));
            }

            response.Data = _context.Channels.Select(channel => channel.Id);
            return response;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "UpdateChannels");
            response.Success = false;
            response.Message = "The error while getting all updated channels occurred." + Environment.NewLine + exception.Message;
            response.Data = [];
            return response;
        }
        finally
        {
            lock (lockObject)
            {
                updateChannelsEnable = true;
            }
        }
    }

    public async Task<ServiceResponse<ChannelDto>> GetChannelInfo(long chatId)
    {
        var response = new ServiceResponse<ChannelDto>();
        try
        {
            if (_context.Channels == null)
            {
                response.Success = false;
                response.Message = "Error fetching data from DB.";
                _logger.Log(LogLevel.Error, "DB context with channels is null.");
                response.Data = null;
                return response;
            }

            var channel = await _context
                .Channels.Where(channel => channel.TlgId == chatId)
                .FirstOrDefaultAsync();
            if (channel == null)
            {
                response.Success = false;
                response.Message = "Channel not found.";
                response.Data = null;
                return response;
            }

            var channelInfoDto = _mapper.Map<ChannelDto>(channel);
            response.Success = true;
            response.Data = channelInfoDto;
            return response;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message, exception);
            response.Success = false;
            response.Data = null;
            response.Message = exception.Message;
            return response;
        }
    }

    public async Task<ServiceResponse<ChannelDto>> UpdateChannelInfo(long chatId)
    {
        var response = new ServiceResponse<ChannelDto>();

        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "UpdateChannels" + Environment.NewLine + "The error while logging telegram user.");
            response.Success = false;
            response.Message = "Unable to login to Telegram";
            return response;
        }

        if (_context.Channels == null)
        {
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            _logger.Log(LogLevel.Error, "DB context with channels is null.");
            response.Data = null;
            return response;
        }

        try
        {
            var chats = await _client.Messages_GetAllChats();
            var chat = chats.chats.Where(item => item.Key == chatId).FirstOrDefault().Value;

            if (chat == null)
            {
                response.Success = false;
                response.Data = null;
                response.Message = "Channel not found";
                return response;
            }

            var chatPeer = chat.ToInputPeer();
            var chatInfo = await _client.GetFullChat(chatPeer);

            // Получаем инфо о канале.
            var channelFullInfoDto = new ChannelDto
            {
                TlgId = chatInfo.full_chat.ID,
                ParticipantsCount = chatInfo.full_chat.ParticipantsCount,
                About = chatInfo.full_chat.About
            };
            MemoryStream ms = new(1000000);
            Storage_FileType storage = await _client.DownloadProfilePhotoAsync(chat, ms);
            channelFullInfoDto.Image = Convert.ToBase64String(ms.ToArray());

            var channelDB = _context.Channels.Where(channel => channel.Id == chatId).FirstOrDefault();
            if (channelDB == null)
            {
                response.Success = false;
                response.Data = null;
                response.Message = "Channel not found";
                return response;
            }

            // Сохраняем в БД.
            channelDB.About = channelFullInfoDto.About;
            channelDB.Image = channelFullInfoDto.Image;
            channelDB.ParticipantsCount = channelFullInfoDto.ParticipantsCount;
            await _context.SaveChangesAsync();

            response.Data = channelFullInfoDto;
            return response;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message, exception);
            response.Success = false;
            response.Data = null;
            response.Message = exception.Message;
            return response;
        }
    }

    public async Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(long chatId, int offset, int count)
    {
        var response = new ServiceResponse<IEnumerable<PostDto>>();

        try
        {
            if (_context.Posts == null)
            {
                response.Success = false;
                response.Message = "Error fetching data from DB.";
                _logger.Log(LogLevel.Error, "DB context with posts is null.");
                response.Data = [];
                return response;
            }

            var posts = await _context.Posts
                .Where(post => post.PeerId == chatId)
                .OrderByDescending(item => item.TlgId)
                .Skip(offset).Take(count)
                .ToListAsync();
            response.Data = _mapper.Map<List<PostDto>>(posts);
            response.Success = true;
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error ocurred while getting channel posts");
            response.Success = false;
            response.Data = [];
            return response;
        }
    }

    //public async Task<ServiceResponse<IEnumerable<PostDto>>> UpdateAndFetchChannelPosts(long chatId)
    //{
    //    var response = new ServiceResponse<IEnumerable<PostDto>>();

    //    try
    //    {
    //        var dbChannelPeer = _context.Channels.First(chat => chat.Id == chatId);
    //        if (dbChannelPeer == null)
    //        {
    //            response.Success = false;
    //            response.Data = null;
    //            response.Message = "Channel not found in DB. Try to update db info";
    //            return response;
    //        }

    //        var chats = await _client.Messages_GetAllChats();
    //        InputPeer peer = chats.chats.First(chat => chat.Key == chatId).Value;

    //        // Получаем из БД последнее сообщение, канала.
    //        var postFromDb = _context.Posts.OrderBy(p => p.PeerId).LastOrDefault();
    //        int offset_id = 0;

    //        // Если пусто, запрашиваем у телеграмма один пост на 31.12.2023.
    //        // Его id используем для запроса новых постов канала как смещение.
    //        if (postFromDb == null)
    //        {
    //            var lastMessagesBase = await _client.Messages_GetHistory(peer, 0, startLoadingDate, 0, 1);
    //            if (lastMessagesBase is not Messages_ChannelMessages channelMessages)
    //            {
    //                response.Data = null;
    //                response.Success = false;
    //                response.Message = "Channel peer is not ChannelMessages";
    //                return response;
    //            }

    //            if (channelMessages.count == 0)
    //            {
    //                response.Data = null;
    //                response.Success = false;
    //                response.Message = "No data";
    //                return response;
    //            }

    //            var msgBase = channelMessages.messages[0];
    //            offset_id = msgBase.ID;
    //        }

    //        // Если не пусто, то
    //        // его id используем для запроса новых постов канала как смещение.
    //        else
    //        {
    //            offset_id = (int)postFromDb.PostId;
    //        }

    //        var messages = new List<PostDto>();
    //        bool needStop = false;

    //        for (int offset = 0; ;)
    //        {
    //            //var messagesBase = await _client.Messages_GetHistory(peer, 0, default, offset, 1000, 0, 0, 0);
    //            //var messagesBase = await _client.Messages_GetHistory(peer, offset_id, default, offset, 100);
    //            var messagesBase = await _client.Messages_GetHistory(
    //                peer,
    //                0,
    //                DateTime.Now,
    //                offset,
    //                100);
    //            if (messagesBase is not Messages_ChannelMessages channelMessages) break;

    //            foreach (var msgBase in channelMessages.messages)
    //            {
    //                if (msgBase.ID <= offset_id)
    //                {
    //                    needStop = true;
    //                    break;
    //                }

    //                if (msgBase is TL.Message msg && !string.IsNullOrEmpty(msg.message))
    //                {
    //                    var postDto = _mapper.Map<PostDto>(msg);
    //                    var postToDb = _mapper.Map<Post>(msg);

    //                    await _context.Posts.AddAsync(postToDb);
    //                    messages.Add(postDto);
    //                }
    //            }
    //            offset += channelMessages.messages.Length;
    //            if (offset >= channelMessages.count) break;

    //            if (needStop)
    //            {
    //                break;
    //            }
    //        }
    //        await _context.SaveChangesAsync();
    //        response.Success = true;

    //        return await GetChannelPosts(chatId);
    //        //response.Data = "Добавлено " + messages.Count + " сообщений";
    //    }
    //    catch (Exception exception)
    //    {
    //        _logger.LogError(exception.Message, exception);
    //        response.Success = false;
    //        response.Data = Enumerable.Empty<PostDto>();
    //        response.Message = exception.Message;
    //    }

    //    return response;
    //}

    public ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, DateTime startTime)
    {
        var response = new ServiceResponse<IEnumerable<PostDto>>();

        if (_context.Posts == null)
        {
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            _logger.Log(LogLevel.Error, "DB context with posts is null.");
            response.Data = [];
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.Data = [];
            return response;
        }

        try
        {
            var postsDB = _context.Posts.Where(post => post.Date >= startTime && post.PeerId == chatId);
            response.Data = _mapper.Map<List<PostDto>>(postsDB);
            response.Success = true;
            return response;
        }
        catch (Exception exception)
        {
            response.Success = false;
            response.Message = exception.Message;
            response.Data = [];
            return response;
        }
    }

    public ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, int startPostTlgId)
    {
        var response = new ServiceResponse<IEnumerable<PostDto>>();

        if (_context.Posts == null)
        {
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            _logger.Log(LogLevel.Error, "DB context with posts is null.");
            response.Data = [];
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.Data = [];
            return response;
        }

        if (startPostTlgId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: the identifier of the start post.";
            response.Data = [];
            return response;
        }

        try
        {
            var postsDB = _context.
                Posts
                .Where(post => post.TlgId >= startPostTlgId && post.PeerId == chatId);
            response.Data = _mapper.Map<List<PostDto>>(postsDB);
            response.Success = true;
            return response;
        }
        catch (Exception exception)
        {
            response.Success = false;
            response.Message = exception.Message;
            response.Data = [];
            return response;
        }
    }

    public async Task UpdateChannelPosts(long chatId, WebSocket webSocket)
    {
        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            var errorMessage = "The error while logging telegram user.";
            _logger.LogError(exception, errorMessage);

            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }





        if (_context.Channels == null)
        {
            var errorMessage = "An error ocurred while updating channel's posts. DB error.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        if (_context.Posts == null)
        {
            var errorMessage = "An error ocurred while updating channel's posts. DB error.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        var buffer = new byte[1024 * 4];
        var receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);

        var _cts = new CancellationTokenSource();

        // test
        int i = 0;
        while (!receiveResult.CloseStatus.HasValue)
        {
            SendAsyncMessage(
                webSocket,
                DateTime.Now.ToString(new CultureInfo("ru-RU"))
                );
            i++;
            Thread.Sleep(1000);

            if (i == 5)
            {

                await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                    receiveResult.CloseStatusDescription,
                    CancellationToken.None);
                return;
            }

            receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
            Console.Write(receiveResult.ToString());
        }

        await webSocket.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
        return;

        // endtest


        try
        {
            var dbChannelPeer = _context
                .Channels.First(chat => chat.TlgId == chatId);

            if (dbChannelPeer == null)
            {
                await webSocket.CloseAsync(
                    WebSocketCloseStatus.InternalServerError,
                    "Channel not found in DB.",
                    CancellationToken.None);
                return;
            }

            var chats = await _client.Messages_GetAllChats();
            var peersWithKey = chats.chats.Where(chat => chat.Key == chatId);

            if (!peersWithKey.Any())
            {
                var errorMessage = "Channel not found in subscriptions. You may have unsubscribed from the channel.";
                await webSocket.CloseAsync(
                    WebSocketCloseStatus.InternalServerError,
                    errorMessage,
                    CancellationToken.None);
                _logger.LogError(errorMessage);
                return;
            }

            // Получаем из БД последнее сообщение, канала.
            var postFromDb = _context.Posts
                .Where(post => post.PeerId == chatId)
                .OrderBy(post => post.TlgId)
                .LastOrDefault();
            int startOffsetId = 0;
            int endOffsetId = 0;

            // Если пусто, запрашиваем у телеграмма последний пост и
            // используем его как начала для скачивания постов в прошлом.
            InputPeer peer = peersWithKey.First().Value;
            if (postFromDb == null)
            {
                var lastMessagesBase = await _client.Messages_GetHistory(peer, 0, DateTime.Now, 0, 1);

                if (lastMessagesBase is not Messages_ChannelMessages channelMessages)
                {
                    await webSocket.CloseAsync(
                        WebSocketCloseStatus.NormalClosure,
                        "Channel peer is not ChannelMessages",
                        CancellationToken.None);
                    _logger.LogInformation("Channel peer is not ChannelMessages");
                    return;
                }

                if (channelMessages.count == 0)
                {
                    await webSocket.CloseAsync(
                        WebSocketCloseStatus.NormalClosure,
                        "No data.",
                        CancellationToken.None);
                    _logger.LogInformation($"No data in the channel {peer.ID}.");
                    return;
                }

                var msgBase = channelMessages.messages[0];
                startOffsetId = msgBase.ID;

                lastMessagesBase = await _client.Messages_GetHistory(peer, 0, startLoadingDate, 0, 1);
                if (lastMessagesBase is not Messages_ChannelMessages end_channelMessages)
                {
                    await webSocket.CloseAsync(
                        WebSocketCloseStatus.NormalClosure,
                        "Channel peer is not ChannelMessages.",
                        CancellationToken.None);
                    _logger.LogInformation("Channel peer is not ChannelMessages.");
                    return;
                }

                if (channelMessages.count == 0)
                {
                    await webSocket.CloseAsync(
                        WebSocketCloseStatus.NormalClosure,
                        "No data",
                        CancellationToken.None);
                    _logger.LogInformation($"No data in the channel {peer.ID}.");
                    return;
                }

                msgBase = end_channelMessages.messages[0];
                endOffsetId = msgBase.ID;
            }

            // Если не пусто, то его id используем для запроса новых постов канала как смещение.
            else
            {
                endOffsetId = (int)postFromDb.TlgId;
            }

            // Возможно потом пригодится.
            bool needBreak = false;

            while (true)
            {
                var messagesBase = await _client.Messages_GetHistory(
                    peer,
                    startOffsetId);

                if (messagesBase is not Messages_ChannelMessages channelMessages) break;

                for (int index = 0; index < channelMessages.messages.Length; index++)
                {
                    if (channelMessages.messages[index].ID <= endOffsetId)
                    {
                        needBreak = true;
                        break;
                    }

                    // TODO Тестируем этот код.
                    // TODO Если текста нет, то отбрасываем. Исправить потом, чтобы все ел.
                    if (channelMessages.messages[index] is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                    {
                        var postToDb = _mapper.Map<Post>(msg);
                        var postDto = _mapper.Map<PostDto>(postToDb);

                        try
                        {
                            // Получаем комментарии.
                            var replies = await _client.Messages_GetReplies(peer, msg.ID);
                            postToDb.CommentsCount = replies.Count;
                            postDto.CommentsCount = replies.Count;

                            //await LoadPostComments(peer, msg, postToDb, replies);

                        }
                        catch (Exception exception)
                        {
                            var errorMessage = "UpdateChannelPosts";
                            _logger.LogError(exception, errorMessage);
                        }
                        finally
                        {
                            await _context.Posts.AddAsync(postToDb);
                            await _context.SaveChangesAsync();

                            if (index % 20 == 0 || index == channelMessages.messages.Length - 1)
                            {
                                SendAsyncMessage(
                                    webSocket,
                                    postDto.Date.ToString("yyyy:MM:dd HH:mm:ss")
                                    );
                            }
                        }
                    }

                    if (index == channelMessages.messages.Length - 1)
                    {
                        startOffsetId = channelMessages.messages[index].ID;
                    }

                    Thread.Sleep(500);
                }

                if (needBreak)
                {
                    break;
                }
            }
            await webSocket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "The request was completed successfully",
                CancellationToken.None);
        }
        catch (InvalidOperationException ex)
        {
            var errorMessage = "An error ocurred while updating channel's posts." +
                " You may no longer subscribe to this channel.";
            _logger.LogError(ex.Message, errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
        }
        catch (Exception ex)
        {
            var errorMessage = "An error ocurred while updating channel's posts.";
            _logger.LogError(ex.Message, errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
        }
    }

    private async Task LoadPostComments(InputPeer peer, Message msg, Post postToDb, Messages_MessagesBase replies)
    {
        //await LoadPostComments(peer, msg, postToDb, replies);


        // Преобразовали их в класс типа из наших моделей.
        List<Comment> comments = [];
        var client_comments = replies.Messages;
        foreach (var comment in client_comments)
        {
            var newComment = _mapper.Map<Comment>(comment);
            newComment.PeerId = peer.ID;
            if (newComment != null)
            {
                comments.Add(newComment);
            }
        }

        // Для кажддого комментария получили его автора.
        for (int commentIndex = 0; commentIndex < comments.Count; commentIndex++)
        {
            comments[commentIndex].PostId = msg.ID;
            var userId = replies.Messages[commentIndex].From.ID;
            if (_context.Accounts != null)
            {
                var user = await _context.Accounts
                    .Where(acc => acc.TlgId == userId)
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    var inputUserFromMessage = new InputUserFromMessage()
                    {
                        peer = (replies as Messages_ChannelMessages).chats.First().Value,
                        msg_id = replies.Messages[commentIndex].ID,
                        user_id = userId
                    };
                    var fullUser = await _client.Users_GetFullUser(inputUserFromMessage);
                    var acc = _mapper.Map<Account>(fullUser.users.First().Value);
                    await _context.Accounts.AddAsync(acc);
                    comments[commentIndex].From = acc;
                }
                else
                {
                    comments[commentIndex].From = user;
                }
            }
        }


        postToDb.Comments.AddRange(comments);
    }

    private async void SendAsyncMessage(WebSocket webSocket, string message)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(message);
        var arraySegment = new ArraySegment<byte>(bytes, 0, bytes.Length);

        await webSocket.SendAsync(
            arraySegment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
    }

    public async Task<ServiceResponse<long>> GetCommentsCount(long chatId, long postId)
    {
        var response = new ServiceResponse<long>();

        if (_context.Comments == null)
        {
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            _logger.Log(LogLevel.Error, "DB context with comments is null.");
            response.Data = 0;
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.Data = 0;
            return response;
        }

        try
        {
            var count = await _context
                .Comments
                .Where(comment => comment.PeerId == chatId && comment.PostId == postId)
                .CountAsync();
            response.Data = count;
            response.Success = true;
            return response;
        }
        catch (Exception exception)
        {
            response.Success = false;
            response.Message = exception.Message;
            response.Data = 0;
            return response;
        }
    }

    public async Task<ServiceResponse<IEnumerable<CommentDto>>> GetComments(long chatId, long postId, int offset = 0, int limit = 10)
    {
        var response = new ServiceResponse<IEnumerable<CommentDto>>();

        if (_context.Comments == null)
        {
            _logger.LogError("GetComments, _context.Comments is null");
            response.Success = false;
            response.Message = "Internal server error";
            response.Data = [];
            return response;
        }

        try
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId && c.PeerId == chatId)
                .OrderBy(c => c.TlgId)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();

            var results = _mapper.Map<List<CommentDto>>(comments);
            response.Data = results;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "GetComments");
            response.Success = false;
            response.Message = "An error has occurred while getting comments." +
                Environment.NewLine +
                exception.Message;
            response.Data = [];
        }

        return response;
    }

    public Task UpdatePostComments(long chatId, long postId)
    {
        throw new NotImplementedException();
    }

    public Task<ServiceResponse<Account>> GetAccaunt(long accountTlgId)
    {
        throw new NotImplementedException();
    }

    public async Task UpdatePostComments(long chatId, long postId, WebSocket webSocket)
    {
        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            var errorMessage = "The error while logging telegram user.";
            _logger.LogError(exception, errorMessage);

            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        if (_context.Comments == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        if (_context.Posts == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        var buffer = new byte[1024 * 4];
        var receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);

        var _cts = new CancellationTokenSource();

        // test
        int i = 0;
        while (!receiveResult.CloseStatus.HasValue)
        {
            SendAsyncMessage(
                webSocket,
                DateTime.Now.ToString(new CultureInfo("ru-RU"))
                );
            i++;
            Thread.Sleep(1000);

            if (i == 5)
            {

                await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                    receiveResult.CloseStatusDescription,
                    CancellationToken.None);
                return;
            }

            receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
            Console.Write(receiveResult.ToString());
        }

        await webSocket.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
        return;

        // endtest
    }

    public async Task<ServiceResponse<long>> GetChannelPostsCount(long chatId)
    {
        var response = new ServiceResponse<long>();

        if (_context.Posts == null)
        {
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            _logger.Log(LogLevel.Error, "DB context with posts is null.");
            response.Data = 0;
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.Data = 0;
            return response;
        }

        try
        {
            var count = await _context.Posts.Where(post => post.PeerId == chatId).CountAsync();
            response.Data = count;
            response.Success = true;
            return response;
        }
        catch (Exception exception)
        {
            response.Success = false;
            response.Message = exception.Message;
            response.Data = 0;
            return response;
        }
    }
}

