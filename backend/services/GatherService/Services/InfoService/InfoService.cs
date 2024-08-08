using AutoMapper;
using GatherMicroservice.Client;
using GatherMicroservice.Data;
using GatherMicroservice.Models;
using GatherMicroservice.Utils;
using Microsoft.EntityFrameworkCore;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Models;
using System;
using System.Text.Json;
using TL;

namespace GatherMicroservice.Services.InfoService
{
    public class InfoService : IInfoService
    {
        // Дата, с которой начинаем загружать данные.
        private DateTime startLoadingDate = DateTime.Parse("Dec 31, 2023");
        ILogger _logger;
        GatherClient _client;
        TL.User? user;
        private readonly IMapper _mapper;
        private readonly DataContext _context;


        public InfoService(GatherClient client, DataContext context, IMapper mapper, ILogger<InfoService> logger)
        {
            _client = client;
            _context = context;
            _mapper = mapper;
            _logger = logger;
            Init();
        }

        private async void Init()
        {
            user = await _client.LoginUserIfNeeded();
        }

        public async Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels(string username)
        {
            var response = new ServiceResponse<IEnumerable<ChannelDto>>();

            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    response.Success = false;
                    response.Message = "User is not defined";
                    response.Data = Enumerable.Empty<ChannelDto>();
                    return response;
                }
                else
                {
                    var user = await _context.Users.Where(u => u.Username == username).FirstOrDefaultAsync();

                    if (user == null)
                    {
                        response.Success = false;
                        response.Data = Enumerable.Empty<ChannelDto>();
                        response.Message = "User not found";
                        return response;
                    }

                    var chats = _context.Channels.Where(channel => channel.User == user).ToList();
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
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "GetAllChannels");
                response.Success = false;
                response.Message = "The error has occurred while getting all channels." + Environment.NewLine + exception.Message;
                response.Data = Enumerable.Empty<ChannelDto>();
                return response;
            }

            return response;
        }

        public async Task<ServiceResponse<IEnumerable<long>>> UpdateChannels(string username)
        {
            var response = new ServiceResponse<IEnumerable<long>>();

            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    response.Success = false;
                    response.Message = "Malformed request data. No user present.";
                    response.Data = Enumerable.Empty<long>();
                    return response;
                }
                else
                {
                    var user = _context.Users.FirstOrDefault(u => u.Username == username);
                    if (user == null)
                    {
                        response.Success = false;
                        response.Message = "User not found.";
                        response.Data = Enumerable.Empty<long>();
                        return response;
                    }

                    // chats = groups/channels (does not include users dialogs)
                    var chats = await _client.Messages_GetAllChats();
                    var chatsFromTG = new List<ChatBase>();
                    foreach (var (id, chat) in chats.chats)
                    {
                        chatsFromTG.Add(chat);
                    }

                    // Добавляем новые в БД.
                    foreach (var chat in chatsFromTG)
                    {
                        try
                        {
                            if (!_context.Channels.Any(channel => channel.Id == chat.ID))
                            {
                                var addedChat = _mapper.Map<SharedCore.Models.Channel>(chat);
                                var channelFullInfo = await _client.GetFullChat(chat);

                                addedChat.User = user;
                                addedChat.About = channelFullInfo.full_chat.About;
                                addedChat.ParticipantsCount = channelFullInfo.full_chat.ParticipantsCount;

                                if (chat.Photo != null)
                                {
                                    MemoryStream ms = new MemoryStream(1000000);
                                    Storage_FileType storage = await _client.DownloadProfilePhotoAsync(chat, ms);
                                    addedChat.Image = Convert.ToBase64String(ms.ToArray());
                                }
                                _context.Channels.Add(addedChat);
                            }
                        }
                        catch (Exception exception)
                        {
                            _logger.LogError(
                                exception.Message + Environment.NewLine +
                                exception.StackTrace + Environment.NewLine +
                                $"channel is: {chat.Title}", "UpdateChannels");
                        }
                    }

                    // Удаляем из БД те, которых в телеграмме уже нет.
                    foreach (var chat in _context.Channels)
                    {
                        if (!chatsFromTG.Any(channel => channel.ID == chat.Id))
                        {
                            _context.Channels.Remove(chat);
                        }
                    }

                    await _context.SaveChangesAsync();
                    response.Data = _context.Channels.Select(channel => channel.Id);
                    return response;
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "UpdateChannels");
                response.Success = false;
                response.Message = "The error while getting all updated channels occurred." + Environment.NewLine + exception.Message;
                response.Data = Enumerable.Empty<long>();
                return response;
            }
        }

        public async Task<ServiceResponse<ChannelInfoDto>> GetChannelInfo(string username, long chatId)
        {
            var response = new ServiceResponse<ChannelInfoDto>();
            if (string.IsNullOrEmpty(username))
            {
                response.Success = false;
                response.Message = "User is not defined";
                response.Data = null;
                return response;
            }
            else
            {
                try
                {
                    var channel = await _context.Channels.Where(channel => channel.Id == chatId).FirstAsync();
                    if (channel == null)
                    {
                        response.Success = false;
                        response.Message = "Channel not found.";
                        response.Data = null;
                    }

                    var channelInfoDto = _mapper.Map<ChannelInfoDto>(channel);
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
        }

        public async Task<ServiceResponse<ChannelInfoDto>> UpdateChannelInfo(string username, long chatId)
        {
            var response = new ServiceResponse<ChannelInfoDto>();
            if (string.IsNullOrEmpty(username))
            {
                response.Success = false;
                response.Message = "User is not defined";
                response.Data = null;
                return response;
            }
            else
            {
                try
                {
                    var chats = await _client.Messages_GetAllChats();
                    var chat = chats.chats.Where(item => item.Key == chatId).FirstOrDefault().Value;

                    if (chat == null)
                    {
                        response.Success = false;
                        response.Data = null;
                        response.Message = "Channel info not found from telegramm API.";
                        return response;
                    }

                    var chatPeer = chat.ToInputPeer();
                    var chatInfo = await _client.GetFullChat(chatPeer);

                    // Получаем инфо о канале.
                    var channelFullInfoDto = new ChannelInfoDto();
                    channelFullInfoDto.Id = chatInfo.full_chat.ID;
                    channelFullInfoDto.ParticipantsCount = chatInfo.full_chat.ParticipantsCount;
                    channelFullInfoDto.About = chatInfo.full_chat.About;
                    MemoryStream ms = new MemoryStream(1000000);
                    Storage_FileType storage = await _client.DownloadProfilePhotoAsync(chat, ms);
                    channelFullInfoDto.Image = Convert.ToBase64String(ms.ToArray());

                    var channelDB = _context.Channels.Where(channel => channel.Id == chatId).FirstOrDefault();
                    if (channelDB == null)
                    {
                        response.Success = false;
                        response.Data = null;
                        response.Message = "Channel not found in DB.";
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
        }

        public async Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(string username, long chatId, int offset, int count)
        {
            var response = new ServiceResponse<IEnumerable<PostDto>>();

            try
            {
                // Проверяем, загружали данные этого чата в БД раньше.
                //var count = await _context.Posts.Where(p => p.PeerId == chatId).Take(2).CountAsync();
                //var isFirstQuery = count == 0;

                //var chats = await _client.Messages_GetAllChats();
                //0InputPeer peer = chats.chats.First(chat => chat.Key == chatId).Value;

                //if (isFirstQuery)
                //{
                //    // Загружаем все данные в БД.
                //    // TODO Отдаем только несколько последних записей и запускаем загрузку в БД всех данных.
                //    int offset_id;
                //    var lastMessagesBase = await _client.Messages_GetHistory(peer, 0, startLoadingDate, 0, 1);

                //    if (lastMessagesBase is not Messages_ChannelMessages channelMessages)
                //    {
                //        response.Data = null;
                //        response.Success = false;
                //        response.Message = "Channel peer is not ChannelMessages";
                //        return response;
                //    }

                //    if (channelMessages.count == 0)
                //    {
                //        response.Data = null;
                //        response.Success = false;
                //        response.Message = "No data";
                //        return response;
                //    }

                //    var firstMsg = channelMessages.messages[0];
                //    offset_id = firstMsg.ID;
                //    lastMessagesBase = await _client.Messages_GetHistory(peer, offset_id);

                //    var messages = new List<PostDto>();
                //    foreach (var msgBase in channelMessages.messages)
                //    {
                //        if (msgBase is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                //        {
                //            var postDto = _mapper.Map<PostDto>(msg);
                //            var postToDb = _mapper.Map<Post>(msg);
                //            await _context.Posts.AddAsync(postToDb);
                //            messages.Add(postDto);
                //        }
                //    }

                //    await _context.SaveChangesAsync();
                //    response.Success = true;
                //    return await GetChannelPosts(chatId);
                //}
                //else
                //{
                //}

                // Получаем дату последней загрузки данных из чата в БД.
                //long offset_id = _context.Posts.Where(post => post.PeerId == chatId).Max(post => post.PostId);
                //var lastMessagesBase = await _client.Messages_GetHistory(peer, (int)offset_id);

                //var messages = new List<PostDto>();
                //var channelMessages = lastMessagesBase as Messages_ChannelMessages;
                //foreach (var msgBase in channelMessages.messages)
                //{
                //    if (msgBase is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                //    {
                //        var postDto = _mapper.Map<PostDto>(msg);
                //        var postToDb = _mapper.Map<Post>(msg);

                //        await _context.Posts.AddAsync(postToDb);
                //        messages.Add(postDto);
                //    }
                //}
                //// Обновляем данные в БД.
                //await _context.SaveChangesAsync();
                //response.Success = true;
                //return response;

                if (string.IsNullOrEmpty(username))
                {
                    response.Success = false;
                    response.Data = Enumerable.Empty<PostDto>();
                    response.Message = "User not defined";
                    return response;
                }

                var posts = _context.Posts.Where(post => post.PeerId == chatId).OrderByDescending(item => item.Id).Skip(offset).Take(count);
                response.Data = _mapper.Map<List<PostDto>>(posts);
                response.Success = true;
                return response;

                //var posts = _context.Posts.AsEnumerable().Where(p => p.PeerId == chatId);
                //response.Data = _mapper.Map<List<PostDto>>(posts);
                //response.Success = true;
                //return response;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.ToString());
                response.Success = false;
                response.Data = Enumerable.Empty<PostDto>();
                response.Message = exception.Message;
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

        public ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(string username, long chatId, DateTime startTime)
        {
            var response = new ServiceResponse<IEnumerable<PostDto>>();

            if (string.IsNullOrEmpty(username))
            {
                response.Success = false;
                response.Message = "User not defined in request";
                response.Data = Enumerable.Empty<PostDto>();
                return response;
            }

            if (chatId <= 0)
            {
                response.Success = false;
                response.Message = "Malformed parameter: chat identifier";
                response.Data = Enumerable.Empty<PostDto>();
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
                response.Data = Enumerable.Empty<PostDto>();
                return response;
            }
        }

        public ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(string username, long chatId, int startPostId)
        {
            var response = new ServiceResponse<IEnumerable<PostDto>>();

            if (string.IsNullOrEmpty(username))
            {
                response.Success = false;
                response.Message = "User not defined in request";
                response.Data = Enumerable.Empty<PostDto>();
                return response;
            }

            if (chatId <= 0)
            {
                response.Success = false;
                response.Message = "Malformed parameter: chat identifier";
                response.Data = Enumerable.Empty<PostDto>();
                return response;
            }

            if (startPostId <= 0)
            {
                response.Success = false;
                response.Message = "Malformed parameter: the identifier of the start post.";
                response.Data = Enumerable.Empty<PostDto>();
                return response;
            }

            try
            {
                var postsDB = _context.Posts.Where(post => post.PostId >= startPostId && post.PeerId == chatId);
                response.Data = _mapper.Map<List<PostDto>>(postsDB);
                response.Success = true;
                return response;
            }
            catch (Exception exception)
            {
                response.Success = false;
                response.Message = exception.Message;
                response.Data = Enumerable.Empty<PostDto>();
                return response;
            }
        }

        public async Task<ServiceResponse<int>> UpdateChannelPosts(string username, long chatId)
        {
            var response = new ServiceResponse<int>();

            if (string.IsNullOrEmpty(username))
            {
                response.Success = false;
                response.Message = "User not defined.";
                return response;
            }

            try
            {
                var dbChannelPeer = _context.Channels.First(chat => chat.Id == chatId && chat.User.Username.Equals(username));
                if (dbChannelPeer == null)
                {
                    response.Success = false;
                    response.Message = "Channel not found in DB.";
                    return response;
                }

                var chats = await _client.Messages_GetAllChats();
                InputPeer peer = chats.chats.First(chat => chat.Key == chatId).Value;

                // Получаем из БД последнее сообщение, канала.
                var postFromDb = _context.Posts.Where(post => post.PeerId == chatId).OrderBy(post => post.PostId).LastOrDefault();
                int startOffsetId = 0;
                int endOffsetId = 0;


                // Если пусто, запрашиваем у телеграмма один пост на 31.12.2023.
                // Его id используем для запроса новых постов канала как смещение.
                if (postFromDb == null)
                {
                    var lastMessagesBase = await _client.Messages_GetHistory(peer, 0, DateTime.Now, 0, 1);
                    if (lastMessagesBase is not Messages_ChannelMessages channelMessages)
                    {
                        response.Success = false;
                        response.Message = "Channel peer is not ChannelMessages";
                        return response;
                    }

                    if (channelMessages.count == 0)
                    {
                        response.Success = false;
                        response.Message = "No data";
                        return response;
                    }

                    var msgBase = channelMessages.messages[0];
                    startOffsetId = msgBase.ID;



                    lastMessagesBase = await _client.Messages_GetHistory(peer, 0, startLoadingDate, 0, 1);
                    if (lastMessagesBase is not Messages_ChannelMessages end_channelMessages)
                    {
                        response.Success = false;
                        response.Message = "Channel peer is not ChannelMessages";
                        return response;
                    }

                    if (channelMessages.count == 0)
                    {
                        response.Success = false;
                        response.Message = "No data";
                        return response;
                    }

                    msgBase = end_channelMessages.messages[0];
                    endOffsetId = msgBase.ID;
                }

                // Если не пусто, то его id используем для запроса новых постов канала как смещение.
                else
                {
                    endOffsetId = (int)postFromDb.PostId;
                }

                // Возможно потом пригодится.
                var messages = new List<PostDto>();
                bool needStop = false;

                while (true)
                {
                    var messagesBase = await _client.Messages_GetHistory(
                        peer,
                        startOffsetId);

                    if (messagesBase is not Messages_ChannelMessages channelMessages) break;
                    //var msgBase in channelMessages.messages
                    for (int index = 0; index < channelMessages.messages.Length; index++)
                    {
                        if (channelMessages.messages[index].ID <= endOffsetId)
                        {
                            needStop = true;
                            break;
                        }

                        // TODO Если текста нет, то отбрасываем. Исправить потом, чтобы все ел.
                        if (channelMessages.messages[index] is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                        {
                            var postDto = _mapper.Map<PostDto>(msg);
                            var postToDb = _mapper.Map<Post>(msg);

                            await _context.Posts.AddAsync(postToDb);
                            messages.Add(postDto);
                        }

                        if (index == channelMessages.messages.Length - 1)
                        {
                            startOffsetId = channelMessages.messages[index].ID;
                        }
                    }

                    if (needStop)
                    {
                        break;
                    }
                }
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Data = messages.Count;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message, exception);
                response.Success = false;
                response.Data = 0;
                response.Message = exception.Message;
            }

            return response;
        }
    }
}
