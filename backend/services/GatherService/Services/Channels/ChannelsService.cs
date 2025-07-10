using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Gather.Utils.Loading;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;
using TL;

namespace Gather.Services.Channels;

public class ChannelsService(
    GatherClient client,
    DataContext context,
    IMapper mapper,
    ILogger<ChannelsService> logger,
    ISettingsConfig settingsconfig,
    IGatherNotifierFabric loadingHelperFabric) : IChannelsService
{
    // Дата, с которой начинаем загружать данные.
    //private readonly DateTime startLoadingDate = DateTime.Parse("May 15, 2025");
    readonly ILogger _logger = logger;
    readonly GatherClient _client = client;
    TL.User? user;
    private readonly IMapper _mapper = mapper;
    private readonly DataContext _context = context;
    readonly Object lockObject = new();
    static bool updateChannelsEnable = true;
    PobeditSettings pobeditSettings = settingsconfig.PobeditSettings;
    readonly IGatherNotifierFabric _loadingHelperFabric = loadingHelperFabric;

    public async Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels()
    {
        var response = new ServiceResponse<IEnumerable<ChannelDto>>();

        if (_context.Channels == null)
        {
            _logger.LogError("GetAllChannels, _context.Channels is null");
            response.Success = false;
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
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
            response.ErrorType = ErrorType.ServerError;
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
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
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
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }

        if (!updateChannelsEnable)
        {
            response.Data = [];
            response.Success = false;
            response.Message = "Channels updates are temporarily unavailable";
            response.ErrorType = ErrorType.ServerError;
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
                            var addedChat = _mapper.Map<Models.Channel>(chatsFromTG[i]);
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
                            // TODO Delete in Production
                            if (channelCount > 10)
                            {
                                break;
                            }
                            // TODO
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
            response.Message = "The error while getting all updated channels occurred."
                + Environment.NewLine
                + exception.Message;
            response.ErrorType = ErrorType.ServerError;
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
                _logger.LogError("DB context with channels is null.");
                response.Success = false;
                response.Message = "Error fetching data from DB.";
                response.ErrorType = ErrorType.ServerError;
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
                response.ErrorType = ErrorType.NotFound;
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
            response.ErrorType = ErrorType.ServerError;
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
            _logger.LogError(exception, "UpdateChannels"
                + Environment.NewLine
                + "The error while logging telegram user.");
            response.Success = false;
            response.Message = "Unable to login to Telegram";
            response.ErrorType = ErrorType.ServerError;
            return response;
        }

        if (_context.Channels == null)
        {
            _logger.LogError("DB context with channels is null.");
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            response.ErrorType = ErrorType.ServerError;
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
                response.ErrorType = ErrorType.NotFound;
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

            var channelDB = _context.Channels.Where(channel => channel.TlgId == chatId).FirstOrDefault();
            if (channelDB == null)
            {
                response.Success = false;
                response.Data = null;
                response.Message = "Channel not found";
                response.ErrorType = ErrorType.NotFound;
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
            response.ErrorType = ErrorType.NotFound;
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
                _logger.LogError("DB context with posts is null.");
                response.Success = false;
                response.Message = "Error fetching data from DB.";
                response.ErrorType = ErrorType.ServerError;
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

    public ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, DateTime startTime)
    {
        var response = new ServiceResponse<IEnumerable<PostDto>>();

        if (_context.Posts == null)
        {
            _logger.LogError("DB context with posts is null.");
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.ErrorType = ErrorType.MalFormedData;
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
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }
    }

    public ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, int startPostTlgId)
    {
        var response = new ServiceResponse<IEnumerable<PostDto>>();

        if (_context.Posts == null)
        {
            _logger.LogError("DB context with posts is null.");
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.ErrorType = ErrorType.MalFormedData;
            response.Data = [];
            return response;
        }

        if (startPostTlgId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: the identifier of the start post.";
            response.ErrorType = ErrorType.MalFormedData;
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
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }
    }

    public async Task UpdateChannelPosts(long chatId, WebSocket webSocket)
    {
        IGatherNotifier loadingHelper = _loadingHelperFabric.Create(webSocket);
        await UpdateChannelPosts(chatId, loadingHelper);
    }

    private async Task UpdateChannelPosts(long chatId, IGatherNotifier loadingHelper)
    {
        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            var errorMessage = "The error while logging telegram user.";
            _logger.LogError(exception, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (_context.Channels == null)
        {
            var errorMessage = "An error ocurred while updating channel's posts. DB error.";
            _logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (_context.Posts == null)
        {
            var errorMessage = "An error ocurred while updating channel's posts. DB error.";
            _logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        try
        {
            var dbChannelPeer = _context
                .Channels.First(chat => chat.TlgId == chatId);

            if (dbChannelPeer == null)
            {
                await loadingHelper.NotifyFailureEndingAsync("Channel not found in DB.");
                return;
            }

            var chats = await _client.Messages_GetAllChats();
            var peersWithKey = chats.chats.Where(chat => chat.Key == chatId);

            if (!peersWithKey.Any())
            {
                var errorMessage = "Channel not found in subscriptions. You may have unsubscribed from the channel.";
                await loadingHelper.NotifyFailureEndingAsync(errorMessage);
                return;
            }

            // Получаем из БД последнее сообщение, канала.
            var postFromDb = _context.Posts
                .Where(post => post.PeerId == chatId)
                .OrderBy(post => post.TlgId)
                .LastOrDefault();
            int startOffsetId = 0;

            // Если пусто, запрашиваем у телеграмма последний пост и
            // используем его как начала для скачивания постов в прошлом.
            InputPeer peer = peersWithKey.First().Value;
            if (postFromDb == null)
            {
                var lastMessagesBase = await _client.Messages_GetHistory(peer, offset_date: pobeditSettings.StartGatherDate, limit: 1);

                if (lastMessagesBase is not Messages_ChannelMessages channelMessages)
                {
                    await loadingHelper.NotifySuccessEndingAsync("Channel peer is not ChannelMessages");
                    _logger.LogInformation("Channel peer is not ChannelMessages");
                    return;
                }

                if (channelMessages.count == 0)
                {
                    await loadingHelper.NotifySuccessEndingAsync($"No data in the channel {peer.ID}.");
                    _logger.LogInformation($"No data in the channel {peer.ID}.");
                    return;
                }

                var msgBase = channelMessages.messages[0];
                startOffsetId = msgBase.ID;
            }
            // Если не пусто, то его id используем для запроса новых постов канала как смещение.
            else
            {
                startOffsetId = (int)postFromDb.TlgId;
            }

            // Возможно потом пригодится.
            bool needBreak = false;

            while (true)
            {
                var messagesBase = await _client.Messages_GetHistory(
                    peer,
                    min_id: startOffsetId);

                if (messagesBase is not Messages_ChannelMessages channelMessages) break;

                if (channelMessages.messages.Count() == 0)
                {
                    break;
                }

                for (int index = 0; index < channelMessages.messages.Length; index++)
                {

                    // TODO Тестируем этот код.
                    // TODO Если текста нет, то отбрасываем. Исправить потом, чтобы все ел.
                    if (channelMessages.messages[index] is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                    {
                        var postToDb = _mapper.Map<Post>(msg);
                        var postDto = _mapper.Map<PostDto>(postToDb);

                        try
                        {
                            // Получаем комментарии.
                            postToDb.CommentsCount = 0;
                            postDto.CommentsCount = 0;

                            await _context.Posts.AddAsync(postToDb);
                            await _context.SaveChangesAsync();
                        }
                        catch (Exception exception)
                        {
                            var errorMessage = "UpdateChannelPosts";
                            _logger.LogError(exception, errorMessage);
                        }

                        if (index % 20 == 0 || index == channelMessages.messages.Length - 1)
                        {
                            await loadingHelper.NotifyProgressAsync(postDto.Date.ToString("yyyy:MM:dd HH:mm:ss"));
                            bool isNeedStop = await loadingHelper.CheckIsNeedStopAsync();
                            if (isNeedStop)
                            {
                                await loadingHelper.NotifySuccessEndingAsync("Closed by client");
                                return;
                            }
                        }
                    }

                    if (index == channelMessages.messages.Length - 1)
                    {
                        startOffsetId = channelMessages.messages[0].ID + 1;
                    }

                    Thread.Sleep(100);
                }

                if (needBreak)
                {
                    break;
                }
            }
            await loadingHelper.NotifySuccessEndingAsync("The request was completed successfully");
        }
        catch (InvalidOperationException ex)
        {
            var errorMessage = "An error ocurred while updating channel's posts." +
                " You may no longer subscribe to this channel.";
            _logger.LogError(ex.Message, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
        }
        catch (Exception ex)
        {
            var errorMessage = "An error ocurred while updating channel's posts.";
            _logger.LogError(ex.Message, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
        }
    }

    public async Task<ServiceResponse<long>> GetChannelPostsCount(long chatId)
    {
        var response = new ServiceResponse<long>();

        if (_context.Posts == null)
        {
            _logger.LogError("DB context with posts is null.");
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            response.ErrorType = ErrorType.ServerError;
            response.Data = 0;
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.ErrorType = ErrorType.MalFormedData;
            response.Data = 0;
            return response;
        }

        var channel = await _context.Channels.Where(c => c.TlgId == chatId).FirstOrDefaultAsync();
        if (channel == null)
        {
            response.Success = false;
            response.Message = "Channel not found.";
            response.ErrorType = ErrorType.NotFound;
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
            response.ErrorType = ErrorType.ServerError;
            response.Data = 0;
            return response;
        }
    }

    public async Task<ServiceResponse<PostDto>> GetChannelPost(long chatId, long postId)
    {
        var response = new ServiceResponse<PostDto>();

        try
        {
            if (_context.Posts == null)
            {
                _logger.LogError("DB context with posts is null.");
                response.Success = false;
                response.Message = "Error fetching data from DB.";
                response.ErrorType = ErrorType.ServerError;
                return response;
            }

            var post = await _context.Posts
                .Where(post => post.PeerId == chatId && post.TlgId == postId)
                .FirstOrDefaultAsync();
            response.Data = _mapper.Map<PostDto>(post);
            response.Success = true;
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error ocurred while getting one channel post");
            response.Success = false;
            return response;
        }
    }

    public async Task<ServiceResponse<long>> GetCommentsCount(long chatId, long postId)
    {
        var response = new ServiceResponse<long>();

        if (_context.Comments == null)
        {
            _logger.LogError("DB context with comments is null.");
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            response.ErrorType = ErrorType.ServerError;
            response.Data = 0;
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.ErrorType = ErrorType.MalFormedData;
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
            response.ErrorType = ErrorType.ServerError;
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
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }

        try
        {
            var comments = await _context.Comments
                .Include(comment => comment.From)
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
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
        }

        return response;
    }

    public async Task UpdatePostComments(long chatId, long postId, WebSocket webSocket)
    {
        IGatherNotifier loadingHelper = _loadingHelperFabric.Create(webSocket);
        await UpdatePostComments(chatId, postId, loadingHelper);
    }

    public async Task UpdatePostComments(long chatId, long postId, IGatherNotifier loadingHelper)
    {
        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            var errorMessage = "The error while logging telegram user.";
            _logger.LogError(exception, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (_context.Comments == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            _logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (_context.Posts == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            _logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        //var buffer = new byte[1024 * 4];
        //var receiveResult = await webSocket.ReceiveAsync(
        //    new ArraySegment<byte>(buffer), CancellationToken.None);

        var post = await _context.Posts.FirstAsync(p => p.TlgId == postId && p.PeerId == chatId);
        if (post == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. Post not found in DB.";
            _logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        var message_chats = await _client.Messages_GetAllChats();

        if (!message_chats.chats.ContainsKey(chatId))
        {
            var errorMessage = "An error ocurred while updating post's comments." +
                "Cannot find channel in telegram. You may have unsubscribed from the channel.";
            _logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        try
        {
            var channel = message_chats.chats[chatId];
            InputMessageID[] meessages_ids = new InputMessageID[1];
            var messageID = new InputMessageID();
            messageID.id = (int)postId;
            var messages = await _client.GetMessages(channel.ToInputPeer(), [messageID]);

            if (messages == null
                || messages.Count == 0
                || messages.Messages == null
                || messages.Messages.Length == 0)
            {
                var errorMessage = "Post not found.";
                _logger.LogError(errorMessage);
                await loadingHelper.NotifyFailureEndingAsync(errorMessage);
                return;
            }

            var msg = messages.Messages[0] as TL.Message;
            if (msg == null)
            {
                var errorMessage = "An error ocurred while updating post's comments. Post is not a message.";
                _logger.LogError(errorMessage);
                await loadingHelper.NotifyFailureEndingAsync(errorMessage);
                return;
            }

            //
            //
            //
            //await LoadPostComments(channel, msg, post, webSocket);

            // Для того, чтобы не добавлять комментарии, которые уже есть в базе.
            var lastCommentId = 0;
            bool commentsExist = _context.Comments
                .Any(c => c.PostId == post.TlgId && c.PeerId == channel.ID);

            var dbCommentsIds = _context.Comments
                    .Where(c => c.PostId == post.TlgId && c.PeerId == channel.ID)
                    .Select(c => c.TlgId).ToHashSet();

            if (commentsExist)
            {
                lastCommentId = (int)_context.Comments
                    .Where(c => c.PostId == post.TlgId && c.PeerId == channel.ID)
                    .Select(c => c.TlgId).Min();
            }

            Messages_MessagesBase replies;

            do
            {
                if (lastCommentId != 0)
                {
                    replies = await _client.Messages_GetReplies(channel, msg.ID, max_id: lastCommentId);
                }
                else
                {
                    replies = await _client.Messages_GetReplies(channel, msg.ID, offset_id: lastCommentId);
                }

                if (replies.Messages.Length == 0)
                {
                    break;
                }
                var client_comments = replies.Messages;

                foreach (var comment in client_comments)
                {
                    // Пропускаем комментарии, которые уже есть в базе.
                    if (dbCommentsIds.Contains(comment.ID))
                    {
                        continue;
                    }

                    var newComment = _mapper.Map<Comment>(comment);
                    try
                    {
                        if (newComment == null)
                        {
                            continue;
                        }

                        newComment.PeerId = channel.ID;
                        newComment.From = new Account();
                        newComment.From.TlgId = comment.From.ID;

                        newComment.PostId = msg.ID;

                        var user = await _context.Accounts
                            .Where(acc => acc.TlgId == newComment.From.TlgId)
                            .FirstOrDefaultAsync();

                        if (user == null)
                        {
                            var channel_messages = replies as Messages_ChannelMessages;
                            if (channel_messages == null)
                            {
                                continue;
                            }

                            var chats = channel_messages.chats;
                            if (chats.Count == 0)
                            {
                                continue;
                            }

                            var inputPeer = chats.First().Value;
                            var inputUserFromMessage = new InputUserFromMessage()
                            {
                                peer = inputPeer,
                                msg_id = comment.ID,
                                user_id = (long)newComment.From.TlgId
                            };

                            var fullUser = await _client.Users_GetFullUser(inputUserFromMessage);
                            var acc = _mapper.Map<Account>(fullUser.users.First().Value);
                            await _context.Accounts.AddAsync(acc);
                            newComment.From = acc;
                        }
                        else
                        {
                            newComment.From = user;
                        }
                    }
                    catch (Exception exception)
                    {
                        _logger.LogError(exception.Message);
                        continue;
                    }

                    try
                    {
                        post.Comments.Add(newComment);
                        await _context.SaveChangesAsync();
                        Thread.Sleep(Random.Shared.Next(50, 150));
                        await loadingHelper.NotifyProgressAsync(newComment.Date.ToString("yyyy:MM:dd HH:mm:ss"));

                        bool isNeedStop = await loadingHelper.CheckIsNeedStopAsync();
                        if (isNeedStop)
                        {
                            await loadingHelper.NotifySuccessEndingAsync("Closed by client");
                            post.CommentsCount = replies.Count;
                            await _context.SaveChangesAsync();
                            return;
                        }
                    }
                    catch (Exception exception)
                    {
                        _logger.LogError("Ошибка добавления комментария: {1}", exception.Message);
                    }
                }

                lastCommentId = client_comments.Last().ID;
            }
            while (true);

            post.CommentsCount = replies.Count;
            await _context.SaveChangesAsync();












            //
            //
            //
        }
        catch (Exception)
        {
            var errorMessage = "An error ocurred while updating post's comments.";
            _logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }
        finally
        {
            await loadingHelper.NotifySuccessEndingAsync("Closing");
        }
    }
}
