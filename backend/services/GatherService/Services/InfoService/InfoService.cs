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
using TL;

namespace GatherMicroservice.Services.InfoService
{
    public class InfoService : IInfoService
    {
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

        public async Task<ServiceResponse<List<ChannelDto>>> GetAllChannels(string username)
        {
            var response = new ServiceResponse<List<ChannelDto>>();

            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    response.Success = false;
                    response.Message = "User is not defined";
                    return response;
                }
                else
                {
                    var user = await _context.Users.Where(u => u.Username == username).FirstOrDefaultAsync();

                    if (user == null)
                    {
                        response.Success = false;
                        response.Data = null;
                        response.Message = "User not found";
                        return response;
                    }

                    var chats = _context.Channels.Where(channel => channel.User == user).ToList();
                    var results = _mapper.Map<List<ChannelDto>>(chats);

                    //_logger.LogDebug($"We are logged-in as {user.Username ?? user.Username} (id {user.Id})");

                    //var chats = await _client.Messages_GetAllChats(); // chats = groups/channels (does not include users dialogs)
                    //_logger.LogDebug("This user has joined the following:");
                    //foreach (var (id, chat) in chats.chats)
                    //    result.Add(chat);

                    response.Data = results;
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
                _logger.LogError(exception, "GetAllUpdatedChannels");
                response.Success = false;
                response.Message = "The error while getting all channels occurred.";
                return response;
            }

            return response;
        }

        public async Task<ServiceResponse<List<ChannelDto>>> GetAllUpdatedChannels(string username)
        {
            var response = new ServiceResponse<List<ChannelDto>>();

            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    response.Success = false;
                    response.Message = "Malformed request data";
                    return response;
                }
                else
                {
                    var user = _context.Users.FirstOrDefault(u => u.Username == username);
                    if (user == null)
                    {
                        response.Success = false;
                        response.Message = "User not found";
                        return response;
                    }

                    var chats = await _client.Messages_GetAllChats(); // chats = groups/channels (does not include users dialogs)
                    _logger.LogDebug("This user has joined the following:");
                    var chatsFromTG = new List<ChatBase>();
                    foreach (var (id, chat) in chats.chats)
                    {
                        chatsFromTG.Add(chat);
                    }

                    // Добавляем новые в БД.
                    foreach (var chat in chatsFromTG)
                    {
                        if (!_context.Channels.Any(channel => channel.Id == chat.ID))
                        {
                            var addedChat = _mapper.Map<SharedCore.Models.Channel>(chat);
                            addedChat.User = user;
                            _context.Channels.Add(addedChat);
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


                    var chatsFromDB = _context.Channels.Where(channel => channel.User == user).ToList();
                    var results = _mapper.Map<List<ChannelDto>>(chatsFromDB);
                    //var results = _mapper.Map<List<ChatBase>>(chatsFromDB);
                    response.Data = results;
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
                _logger.LogError(exception, "GetAllUpdatedChannels");
                response.Success = false;
                response.Message = "The error while getting all updated channels occurred.";
                return response;
            }

            return response;
        }

        public async Task<ServiceResponse<List<ChatBase>>> UpdateChannels(string username)
        {
            // Запраашивает каналы у телеграмма и обновляет данные в БД.
            throw new NotImplementedException();

            var response = new ServiceResponse<List<ChatBase>>();

            if (user == null)
            {
                response.Success = false;
                response.Message = "User is not defined";
            }
            else
            {
                var result = new List<ChatBase>();
                _logger.LogDebug($"We are logged-in as {user.username ?? user.first_name + " " + user.last_name} (id {user.id})");

                var chats = await _client.Messages_GetAllChats(); // chats = groups/channels (does not include users dialogs)
                _logger.LogDebug("This user has joined the following:");
                foreach (var (id, chat) in chats.chats)
                    result.Add(chat);
                response.Data = result;
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

            return response;
        }

        public async Task<ServiceResponse<ChannelFullInfoDto>> GetChannelInfo(long chatId)
        {
            var response = new ServiceResponse<ChannelFullInfoDto>();
            if (user == null)
            {
                response.Success = false;
                response.Message = "User is not defined";
            }
            else
            {
                try
                {
                    var chats = await _client.Messages_GetAllChats();
                    var chat = chats.chats.Where(item => item.Key == chatId).FirstOrDefault().Value;

                    var chatPeer = chat.ToInputPeer();
                    var chatInfo = await _client.GetFullChat(chatPeer);

                    var channelFullInfoDto = new ChannelFullInfoDto();
                    channelFullInfoDto.ChannelId = chatInfo.full_chat.ID;
                    channelFullInfoDto.ParticipantsCount = chatInfo.full_chat.ParticipantsCount;
                    channelFullInfoDto.About = chatInfo.full_chat.About;

                    MemoryStream ms = new MemoryStream(1000000);
                    Storage_FileType storage = await _client.DownloadProfilePhotoAsync(chat, ms);
                    channelFullInfoDto.ChannelPhoto = Convert.ToBase64String(ms.ToArray());
                    response.Data = channelFullInfoDto;
                }
                catch (Exception exception)
                {
                    _logger.LogError(exception.Message, exception);
                    response.Success = false;
                    response.Data = null;
                    response.Message = exception.Message;
                }
            }
            return response;
        }

        public async Task<ServiceResponse<List<PostDto>>> GetAllChannelPosts(long chatId)
        {
            var response = new ServiceResponse<List<PostDto>>();

            try
            {
                var posts = _context.Posts.AsEnumerable().Where(p => p.PeerId == chatId).TakeLast(10);
                response.Data = _mapper.Map<List<PostDto>>(posts);
                response.Success = true;
                return response;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.ToString());
                response.Success = false;
                response.Data = null;
                response.Message = exception.Message;
                return response;
            }
        }

        public async Task<ServiceResponse<string>> LoadNewChannelPosts(long chatId)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var dbChannelPeer = _context.Channels.First(chat => chat.Id == chatId);
                if (dbChannelPeer == null)
                {
                    response.Success = false;
                    response.Data = null;
                    response.Message = "Channel not found in DB. Try to update db info";
                    return response;
                }

                var chats = await _client.Messages_GetAllChats();
                InputPeer peer = chats.chats.First(chat => chat.Key == chatId).Value;

                // Получаем из БД последнее сообщение, канала.
                var postFromDb = _context.Posts.OrderBy(p => p.PeerId).LastOrDefault();
                int offset_id = 0;

                // Если пусто, запрашиваем у телеграмма один пост на 31.12.2023.
                // Его id используем для запроса новых постов канала как смещение.
                if (postFromDb == null)
                {
                    var lastMessagesBase = await _client.Messages_GetHistory(peer, 0, DateTime.Parse("Dec 31, 2023"), 0, 1);
                    if (lastMessagesBase is not Messages_ChannelMessages channelMessages)
                    {
                        response.Data = null;
                        response.Success = false;
                        response.Message = "Channel peer is not ChannelMessages";
                        return response;
                    }

                    if (channelMessages.count == 0)
                    {
                        response.Data = null;
                        response.Success = false;
                        response.Message = "No data";
                        return response;
                    }

                    var msgBase = channelMessages.messages[0];
                    offset_id = msgBase.ID;
                }

                // Если не пусто, то
                // его id используем для запроса новых постов канала как смещение.
                else
                {
                    offset_id = (int)postFromDb.PostId;
                }

                var messages = new List<PostDto>();
                bool needStop = false;

                for (int offset = 0; ;)
                {
                    //var messagesBase = await _client.Messages_GetHistory(peer, 0, default, offset, 1000, 0, 0, 0);
                    //var messagesBase = await _client.Messages_GetHistory(peer, offset_id, default, offset, 100);
                    var messagesBase = await _client.Messages_GetHistory(
                        peer,
                        0,
                        DateTime.Now,
                        offset,
                        100);
                    if (messagesBase is not Messages_ChannelMessages channelMessages) break;

                    foreach (var msgBase in channelMessages.messages)
                    {
                        if (msgBase.ID <= offset_id)
                        {
                            needStop = true;
                            break;
                        }

                        if (msgBase is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                        {
                            var postDto = _mapper.Map<PostDto>(msg);
                            var postToDb = _mapper.Map<Post>(msg);

                            await _context.Posts.AddAsync(postToDb);
                            messages.Add(postDto);
                        }
                    }
                    offset += channelMessages.messages.Length;
                    if (offset >= channelMessages.count) break;

                    if (needStop)
                    {
                        break;
                    }
                }
                await _context.SaveChangesAsync();
                response.Success = true;

                response.Data = "Добавлено " + messages.Count + " сообщений";
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message, exception);
                response.Success = false;
                response.Data = "";
                response.Message = exception.Message;
            }

            return response;
        }

        public Task<ServiceResponse<List<PostDto>>> GetChannelPosts(long chatId, DateTime startTime)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResponse<List<PostDto>>> GetChannelPosts(long chatId, int startPostId)
        {
            throw new NotImplementedException();
        }
    }
}
