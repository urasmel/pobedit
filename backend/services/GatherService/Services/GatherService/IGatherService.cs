using GatherMicroservice.Models;

namespace GatherMicroservice.Services
{
    public interface IGatherService
    {
        Task<ServiceResponse<bool>> StartGatherAll(string username);
        Task<ServiceResponse<bool>> GetGatherStatus(string username);
        Task<ServiceResponse<bool>> StopGatherStatus(string username);
    }
}
