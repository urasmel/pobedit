using Gather.Dtos;
using Gather.Models;
using System.Net.WebSockets;

namespace Gather.Services.Channels;

public interface IChannelsService
{
    Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels();

    Task<ServiceResponse<IEnumerable<long>>> UpdateChannels();

    Task<ServiceResponse<ChannelDto>> UpdateChannelInfo(long chatId);

    Task<ServiceResponse<ChannelDto>> GetChannelInfo(long chatId);

    Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(long chatId, int offset, int count);

    Task<ServiceResponse<PostDto>> GetChannelPost(long chatId, long postId);

    Task<ServiceResponse<long>> GetChannelPostsCount(long chatId);

    ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, DateTime startTime);

    Task UpdateChannelPosts(long chatId, WebSocket webSocket);

    Task UpdatePostComments(long chatId, long postId, WebSocket webSocket);

    Task<ServiceResponse<long>> GetCommentsCount(long chatId, long postId);

    Task<ServiceResponse<IEnumerable<CommentDto>>> GetComments(long chatId, long postId, int offset = 0, int limit = 0);
}
