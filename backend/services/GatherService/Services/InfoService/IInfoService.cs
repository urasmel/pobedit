using GatherMicroservice.Models;
using SharedCore.Dtos;
using TL;

namespace GatherMicroservice.Services
{
    public interface IInfoService
    {
        Task<ServiceResponse<List<ChatBase>>> GetAllChats(string username);

        Task<ServiceResponse<ChatFullInfoDto>> GetChatInfo(long chatId);

        Task<ServiceResponse<List<PostDto>>> GetChatMessages(long chatId);

        Task<ServiceResponse<List<PostDto>>> GetChatMessages(long chatId, DateTime startTime);


        Task<ServiceResponse<List<PostDto>>> GetChatMessages(long chatId, int startPostId);
    }
}
