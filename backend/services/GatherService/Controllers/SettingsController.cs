using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class SettingsController(ISettingsService settingsService, RequestMetrics metrics) : ControllerBase
{
    ISettingsService _settingsService = settingsService;
    private readonly RequestMetrics _metrics = metrics;

    /// <summary>
    /// Возвращает настройки приложения.
    /// </summary>
    [HttpGet]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<ServiceResponse<PobeditSettingsDto>> Get()
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            Log.Information("Settings requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "Get"
                }
            );

            var response = _settingsService.GetSettings();
            if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }

            return Ok(response);
        }
        finally
        {
            stopwatch.Stop();
            _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
        }
    }

    /// <summary>
    /// Устанавливает новые настройки приложения.
    /// </summary>
    [HttpPut]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<ServiceResponse<bool>> Save([FromBody] PobeditSettingsDto pobeditSettingsDto)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            Log.Information("Saving settings requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "Save"
                }
            );

            var response = _settingsService.SaveSettings(pobeditSettingsDto);
            if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
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
