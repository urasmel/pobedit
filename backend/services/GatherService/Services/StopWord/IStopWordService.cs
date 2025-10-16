using Gather.Dtos;
using Gather.Models;

namespace Gather.Services;

public interface IStopWordService
{
    ServiceResponse<IEnumerable<StopWordDto>> GetStopWords();

    Task<ServiceResponse<StopWordDto>> GetStopWord(long id);

    Task<ServiceResponse<StopWordDto>> CreateStopWord(string stopWord);

    Task<ServiceResponse<StopWordDto>> UpdateStopWord(StopWordDto stopWordDto);

    Task<ServiceResponse<bool>> DeleteStopWord(long id);
}
