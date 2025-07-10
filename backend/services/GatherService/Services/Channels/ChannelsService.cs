using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Gather.Utils.Gather.Notification;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;
using TL;

namespace Gather.Services.Channels;

public class ChannelsService(
    GatherClient client,
    DataContext context,
    IMapper mapper,
    ILogger<ChannelsService> logger,
    ISettingsService _settingsService,
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
    PobeditSettings pobeditSettings = _settingsService.PobeditSettings;
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

}
