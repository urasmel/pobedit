using Gather.Models;

namespace Gather.Services.Search;

public interface ISearchService
{

    Task<ServiceResponse<object>> Search(SearchQuery query);
}
