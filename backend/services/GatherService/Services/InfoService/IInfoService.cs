using Gather.Dtos;
using Gather.Models;
using System.Net.WebSockets;

namespace Gather.Services.InfoService;

public interface IInfoService
{
    Task UpdatePostComments(long chatId, long postId, WebSocket webSocket);

    Task<ServiceResponse<long>> GetCommentsCount(long chatId, long postId);

    Task<ServiceResponse<IEnumerable<CommentDto>>> GetComments(long chatId, long postId, int offset = 0, int limit = 0);
}
