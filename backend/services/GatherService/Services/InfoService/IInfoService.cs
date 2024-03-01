using GatherMicroservice.Models;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using TL;

namespace GatherMicroservice.Services
{
    public interface IInfoService
    {
        Task<ServiceResponse<List<ChannelDto>>> GetAllChannels(string username);

        Task<ServiceResponse<List<ChannelDto>>> GetAllUpdatedChannels(string username);

        Task<ServiceResponse<ChannelFullInfoDto>> GetChannelInfo(long chatId);

        Task<ServiceResponse<List<PostDto>>> GetChannelPosts(long chatId);

        Task<ServiceResponse<List<PostDto>>> GetChannelPosts(long chatId, DateTime startTime);


        Task<ServiceResponse<List<PostDto>>> GetChannelPosts(long chatId, int startPostId);
    }
}
