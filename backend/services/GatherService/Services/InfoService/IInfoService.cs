using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using TL;

namespace GatherMicroservice.Services
{
    public interface IInfoService
    {
        Task<ServiceResponse<List<ChatBase>>> GetAllChats(string username);

        Task<ServiceResponse<ChatFullInfoDto>> GetChatInfo(long chatId);

        Task<ServiceResponse<List<MessageDto>>> GetChatMessages(long chatId);
    }
}
