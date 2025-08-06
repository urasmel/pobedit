using Asp.Versioning;
using Gather.Models;
using Gather.Services.Search;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers;

[ApiController]
[Produces("application/json")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpPost]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ServiceResponse<IEnumerable<object>>>> Get([FromBody] SearchQuery query)
    {
        Log.Information("Search requested at {Time}", 
            DateTime.Now,
            new
            {
                method = "Get"
            }
        );

        var response = await _searchService.Search(query);

        if (response.Success == false)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        return Ok(response);
    }
}
