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
        Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels(string username);

        Task<ServiceResponse<IEnumerable<long>>> UpdateChannels(string username);


        Task<ServiceResponse<ChannelDto>> UpdateChannelInfo(string username, long chatId);

        Task<ServiceResponse<ChannelDto>> GetChannelInfo(string username, long chatId);

        Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(string username, long chatId, int offset, int count);

        ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(string username, long chatId, DateTime startTime);

        //Task<ServiceResponse<int>> UpdateChannelPosts(string username, long chatId);
        Task UpdateChannelPosts(string username, long chatId, WebSocket webSocket);
    }
}
