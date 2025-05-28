using Gather.Dtos.Gather;
using Gather.Models;

namespace Gather.Services;

public interface IGatherService
{
    Task<ServiceResponse<bool>> StartGatherAllAsync();
        
    Task<ServiceResponse<bool>> StopGatherStatusAsync();

    ServiceResponse<GatherStateDto> GetGatherState();
}
