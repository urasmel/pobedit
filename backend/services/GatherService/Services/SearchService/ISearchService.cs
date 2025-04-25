using Gather.Models;

namespace Gather.Services.SearchService
{
    public interface ISearchService
    {

        Task<ServiceResponse<object>> Search(SearchQuery query);
    }
}
