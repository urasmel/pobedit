using Gather.Models;

namespace Gather.Services.SearchService
{
    public interface ISearchService
    {

        Task<ServiceResponse<IEnumerable<object>>> Search(SearchQuery query);
    }
}
