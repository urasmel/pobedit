using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Services.Gather;

namespace Gather.Services;

public interface IGatherService
{
    Task<ServiceResponse<bool>> StopGatherAsync();

    ServiceResponse<GatherStateDto> GetGatherState();

    Task<ServiceResponse<bool>> StartGatherAsync(BackgroundTask task);
}
