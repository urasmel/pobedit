using Gather.Dtos;
using Gather.Models;
using System.Net.WebSockets;

namespace Gather.Services.Posts;

public interface IPostsService
{
    Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(long chatId, int offset, int count);

    Task<ServiceResponse<PostDto>> GetChannelPost(long chatId, long postId);

    Task<ServiceResponse<long>> GetChannelPostsCount(long chatId);

    ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, DateTime startTime);

    Task UpdateChannelPosts(long chatId, WebSocket webSocket);
}
