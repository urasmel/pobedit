using Asp.Versioning;
using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Services;
using Gather.Services.Gather;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;

namespace Gather.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class GatherController : ControllerBase
{
    private readonly ILogger<GatherController> _logger;
    IGatherService _gatherService;

    public GatherController(
        IGatherService gatherService,
        ILogger<GatherController> logger)
    {
        _gatherService = gatherService;
        _logger = logger;
    }

    /// <summary>
    /// Запускает процесс сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpPost("start")]
    public async Task<ActionResult<ServiceResponse<int>>> StartGather()
    {
        var task = new BackgroundTask();

        try
        {
            bool success = await _gatherService.StartGatherAsync(task);

            if (success)
            {
                _logger.LogInformation("Task {TaskId} enqueued.", task.Id);
                return Accepted();
            }
            else
            {
                _logger.LogInformation("Task {TaskId} not enqueued.", task.Id);
                return StatusCode(StatusCodes.Status429TooManyRequests);
            }
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message, exception);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Останавливает процесс сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpPost("stop")]
    public ActionResult<ServiceResponse<bool>> StopGather()
    {
        try
        {
            var result = _gatherService.StopGatherAsync();
            return result;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message, exception);
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