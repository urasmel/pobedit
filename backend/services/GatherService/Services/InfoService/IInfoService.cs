using GatherMicroservice.Models;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Models;
using TL;

namespace GatherMicroservice.Services
{
    public interface IInfoService
    {
        Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels(string username);

        Task<ServiceResponse<IEnumerable<long>>> UpdateChannels(string username);

        Task<ServiceResponse<int>> DownloadChannelUpdates(string username, long chatId);

        Task<ServiceResponse<ChannelInfoDto>> UpdateChannelInfo(string username, long chatId);

        Task<ServiceResponse<ChannelInfoDto>> GetChannelInfo(string username, long chatId);

        Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(string username, long chatId, int offset, int count);

        ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(string username, long chatId, DateTime startTime);
    }
}
