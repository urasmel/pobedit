using Gather.Models;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Models;
using System.Net.WebSockets;
using TL;

namespace Gather.Services
{
    public interface IInfoService
    {
        Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels();

        Task<ServiceResponse<IEnumerable<long>>> UpdateChannels();


        Task<ServiceResponse<ChannelDto>> UpdateChannelInfo(long chatId);

        Task<ServiceResponse<ChannelDto>> GetChannelInfo(long chatId);

        Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(long chatId, int offset, int count);

        ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, DateTime startTime);

        //Task<ServiceResponse<int>> UpdateChannelPosts(string username, long chatId);
        Task UpdateChannelPosts(long chatId, WebSocket webSocket);

        Task<ServiceResponse<int>> GetCommentsCount(long chatId, long postId);

        Task<ServiceResponse<IEnumerable<Comment>>> GetComments( long chatId, long postId);

        Task UpdatePostComments(long chatId, long postId);

        Task<ServiceResponse<Account>> GetAccaunt(long accountTlgId);
    }
}
