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
