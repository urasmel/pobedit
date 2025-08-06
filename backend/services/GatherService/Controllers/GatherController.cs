using Asp.Versioning;
using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Services;
using Gather.Services.Gather;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class GatherController : ControllerBase
{
    IGatherService _gatherService;

    public GatherController(
        IGatherService gatherService)
    {
        _gatherService = gatherService;
    }

    /// <summary>
    /// Запускает процесс сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpGet("start")]
    public async Task<ActionResult<ServiceResponse<bool>>> StartGather()
    {
        var task = new BackgroundTask();

        try
        {
            var response = await _gatherService.StartGatherAsync(task);

            if (response.Success)
            {
                Log.Information($"Task {task.Id} enqueued successfully.",
                    new
                    {
                        method = "StartGather"
                    }
                );
                return Accepted(response);
            }
            else
            {
                Log.Information($"Task {task.Id} enqueued with error.",
                    new
                    {
                        method = "StartGather"
                    }
                );
                if (response.ErrorType == ErrorType.TooManyRequests)
                {
                    return StatusCode(StatusCodes.Status429TooManyRequests);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error starting gather.",
                new
                {
                    method = "StartGather"
                }
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Останавливает процесс сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpGet("stop")]
    public ActionResult<ServiceResponse<bool>> StopGather()
    {
        try
        {
            var result = _gatherService.StopGatherAsync();
            return result;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error stopping gather",
                new
                {
                    method = "StopGather"
                }
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
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