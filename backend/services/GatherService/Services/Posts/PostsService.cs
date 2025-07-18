using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Gather.Utils.Gather;
using Gather.Utils.Gather.Notification;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;
using TL;

namespace Gather.Services.Posts;

public class PostsService(
    GatherClient client,
    DataContext context,
    IMapper mapper,
    ILogger<PostsService> logger,
    ISettingsService _settingsService,
    IGatherNotifierFabric loadingHelperFabric) : IPostsService
{
    // Дата, с которой начинаем загружать данные.
    readonly ILogger _logger = logger;
    readonly GatherClient _client = client;
    //TL.User? user;
    private readonly IMapper _mapper = mapper;
    private readonly DataContext _context = context;
    PobeditSettings pobeditSettings = _settingsService.PobeditSettings;
    readonly IGatherNotifierFabric _loadingHelperFabric = loadingHelperFabric;

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
        //await UpdateChannelPosts(chatId, loadingHelper);
        await Gatherer.UpdateChannelPosts(chatId, loadingHelper, _client, _context, mapper, pobeditSettings, _logger);
    }

    private async Task UpdateChannelPosts(long chatId, IGatherNotifier loadingHelper)
    {
        //try
        //{
        //    user ??= await _client.LoginUserIfNeeded();
        //}
        //catch (Exception exception)
        //{
        //    var errorMessage = "The error while logging telegram user.";
        //    _logger.LogError(exception, errorMessage);
        //    await loadingHelper.NotifyFailureEndingAsync(errorMessage);
        //    return;
        //}

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
}
