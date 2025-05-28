using Microsoft.AspNetCore.Mvc;
using Gather.Services;
using Asp.Versioning;
using Gather.Models;
using Gather.Dtos.Gather;

namespace Gather.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class GatherController : ControllerBase
{
    private readonly IGatherService _gatherService;

    public GatherController(IGatherService gatherService)
    {
        _gatherService = gatherService;
    }

    /// <summary>
    /// Запускает процесс сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpPost("start")]
    public async Task<ActionResult<bool>> StartGatherAll()
    {
        var response = await _gatherService.StartGatherAllAsync();
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }


    /// <summary>
    /// Возвращает состояние процесса сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpGet("state")]
    public ActionResult<ServiceResponse<GatherStateDto>> GetGatherStatus()
    {
        var response = _gatherService.GetGatherState();
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}
// TODO общие модели и дтошки в проект библиотеки классов
// apiid and apihash хранить в конфиге