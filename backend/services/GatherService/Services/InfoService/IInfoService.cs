using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using TL;

namespace GatherMicroservice.Services
{
    public interface IInfoService
    {
        Task<ServiceResponse<List<ChatBase>>> GetAllChats(string username);

        Task<ServiceResponse<ChatFullInfoDto>> GetChatInfo(long chatId);

        Task<ServiceResponse<List<MessageInfoDto>>> GetChatMessages(long chatId);

        Task<ServiceResponse<List<MessageInfoDto>>> GetChatMessages(long chatId, DateTime startTime);


        Task<ServiceResponse<List<MessageInfoDto>>> GetChatMessages(long chatId, int startPostId);
    }
}
