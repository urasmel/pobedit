using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Gather.Utils.Gather;
using Gather.Utils.Gather.Notification;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Net.WebSockets;

namespace Gather.Services.Comments;

public class CommentsService(
    GatherClient client,
    DataContext context,
    IMapper mapper,
    ISettingsService _settingsService,
    IGatherNotifierFabric loadingHelperFabric) : ICommentsService
{
    readonly GatherClient _client = client;
    private readonly IMapper _mapper = mapper;
    private readonly DataContext _context = context;
    readonly Object lockObject = new();
    static bool updateChannelsEnable = true;
    PobeditSettings pobeditSettings = _settingsService.PobeditSettings;
    readonly IGatherNotifierFabric _loadingHelperFabric = loadingHelperFabric;

    public async Task<ServiceResponse<long>> GetCommentsCount(long chatId, long postId)
    {
        var response = new ServiceResponse<long>();

        if (_context.Comments == null)
        {
            Log.Error("DB context with comments is null",
                new
                {
                    method = "GetCommentsCount"
                }
            );

            response.Success = false;
            response.Message = "Error fetching data from DB";
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
            var pId = await _context.Posts.Where(p => p.TlgId == postId && p.PeerId == chatId).FirstOrDefaultAsync(); 
            var count = await _context
                .Comments
                .Where(comment => comment.PeerId == chatId && comment.PostId == pId.PostId)
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
            Log.Error("_context.Comments is null",
                new
                {
                    method = "GetComments"
                }
            );

            response.Success = false;
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }

        try
        {
            var pId = await _context.Posts.Where(p => p.TlgId == postId && p.PeerId == chatId).FirstOrDefaultAsync();

            if (pId == null)
            {
                Log.Error("Post not found. chatId: {chatId}, postId: {postId}",
                    chatId, 
                    postId,
                    new
                    {
                        method = "GetComments"
                    }
                );

                response.Success = false;
                response.Message = "Post not found";
                response.ErrorType = ErrorType.ServerError;
                response.Data = [];
            }

            var comments = await _context.Comments
                .Include(comment => comment.From)
                .Where(c => c.PostId == pId.PostId)
                .OrderBy(c => c.TlgId)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();

            var results = _mapper.Map<List<CommentDto>>(comments);
            response.Data = results;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error fetching comments",
                new
                {
                    method = "GetComments"
                }
            );

            response.Success = false;
            response.Message = "An error has occurred while getting comments" +
                Environment.NewLine +
                ex.Message;
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
        }

        return response;
    }

    public async Task UpdatePostComments(long chatId, long postId, WebSocket webSocket)
    {
        IGatherNotifier loadingHelper = _loadingHelperFabric.Create(webSocket);
        await Gatherer.UpdatePostComments(chatId, postId, loadingHelper, _client, _context, _mapper, pobeditSettings);
    }
}
