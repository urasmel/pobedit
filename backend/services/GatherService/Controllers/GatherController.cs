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
public class GatherController(IGatherService gatherService, RequestMetrics metrics) : ControllerBase
{
    IGatherService _gatherService = gatherService;
    private readonly RequestMetrics _metrics = metrics;

    /// <summary>
    /// Запускает процесс сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpGet("start")]
    public async Task<ActionResult<ServiceResponse<bool>>> StartGather()
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        Log.Information("Start gathering requested at {Time}",
            DateTime.Now,
            new
            {
                method = "StartGather"
            }

        );

        var task = new BackgroundTask();

        try
        {
            var response = await _gatherService.StartGatherAsync(task);

            if (response.Success)
            {
                Log.Information("Task {taskId} enqueued successfully",
                    task.Id,
                    new
                    {
                        method = "StartGather"
                    }
                );

                return Accepted(response);
            }
            else
            {
                Log.Information("Task {taskId} enqueued with error",
                    task.Id,
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
            Log.Error(ex, "Error starting gather",
                new
                {
                    method = "StartGather"
                }
            );

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        finally
        {
            stopwatch.Stop();
            _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
        }
    }

    /// <summary>
    /// Останавливает процесс сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpGet("stop")]
    public async Task<ActionResult<ServiceResponse<bool>>> StopGather()
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            Log.Information("Stop gathering requested at {Time}",
                DateTime.Now,
                new
                { method = "StopGather" }
            );

            var result = await _gatherService.StopGatherAsync();

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error stopping gather",
                new { method = "StopGather" }
            );

            var errorResponse = new ServiceResponse<bool>
            {
                Success = false,
                Message = "An error occurred while stopping the gather process",
                Data = false
            };

            return StatusCode(StatusCodes.Status500InternalServerError, errorResponse);
        }
        finally
        {
            stopwatch.Stop();
            _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
        }
    }


    /// <summary>
    /// Возвращает состояние процесса сбора информации в БД.
    /// </summary>
    [MapToApiVersion(1.0)]
    [HttpGet("state")]
    public ActionResult<ServiceResponse<GatherStateDto>> GetGatherStatus()
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            Log.Information("Gathering result requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetGatherStatus"
                }
            );

            var response = _gatherService.GetGatherState();
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        finally
        {
            stopwatch.Stop();
            _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
        }
    }
}
// TODO общие модели и дтошки в проект библиотеки классов
// apiid and apihash хранить в конфиге