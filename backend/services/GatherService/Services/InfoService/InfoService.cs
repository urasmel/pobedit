using AutoMapper;
using GatherMicroservice.Client;
using GatherMicroservice.Data;
using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using GatherMicroservice.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using TL;

namespace GatherMicroservice.Services.InfoService
{
    public class InfoService : IInfoService
    {
        ILogger _logger;
        GatherClient _client;
        User? user;
        private readonly IMapper _mapper;
        IConfigUtils _configUtils;
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

        public async Task<ServiceResponse<List<ChannelDto>>?> GetAllChannels(string username)
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
                    var user = _context.Users.Where(u => u.Username == username).FirstOrDefault();

                    if (user == null)
                    {
                        response.Success = false;
                        response.Data = null;
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
                var chats = await _client.Messages_GetAllChats();
                var chat = chats.chats.Where(chat => chat.Key == chatId).FirstOrDefault().Value;

                var chatPeer = chat.ToInputPeer();
                var chatInfo = await _client.GetFullChat(chatPeer);

                var chatFullInfoDto = new ChannelFullInfoDto();
                chatFullInfoDto.ChatId = chatInfo.full_chat.ID;
                chatFullInfoDto.ParticipantsCount = chatInfo.full_chat.ParticipantsCount;
                chatFullInfoDto.About = chatInfo.full_chat.About;

                MemoryStream ms = new MemoryStream(1000000);
                Storage_FileType storage = await _client.DownloadProfilePhotoAsync(chat, ms);
                chatFullInfoDto.ChatPhoto = Convert.ToBase64String(ms.ToArray());
                response.Data = chatFullInfoDto;
            }
            return response;
        }

        public async Task<ServiceResponse<List<PostDto>>> GetChannelPosts(long chatId)
        {
            var response = new ServiceResponse<List<PostDto>>();


            var chats = await _client.Messages_GetAllChats();
            InputPeer peer = chats.chats.First(chat => chat.Key == chatId).Value;


            var messages = new List<PostDto>();

            for (int offset = 0; ;)
            {
                //var messagesBase = await _client.Messages_GetHistory(peer, 0, default, offset, 1000, 0, 0, 0);
                var messagesBase = await _client.Messages_GetHistory(peer);
                if (messagesBase is not Messages_ChannelMessages channelMessages) break;
                foreach (var msgBase in channelMessages.messages)
                {
                    if (msgBase is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                    {
                        //messages.Add(msgBase as Message);
                        var messageDto = _mapper.Map<PostDto>(msg);
                        messages.Add(messageDto);
                    }
                    //
                    //break;
                }
                offset += channelMessages.messages.Length;
                if (offset >= channelMessages.count) break;

                //
                break;
            }




            response.Data = messages;
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
