using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services;
using Microsoft.AspNetCore.Mvc;

namespace Gather.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class SettingsController:ControllerBase
{
    ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    /// <summary>
    /// Возвращает настройки приложения.
    /// </summary>
    [HttpGet]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<ServiceResponse<PobeditSettingsDto>> GetAllChannels()
    {
        var response = _settingsService.GetSettings();
        if (!response.Success)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        return Ok(response);
    }

    /// <summary>
    /// Устанавливает новые настройки приложения.
    /// </summary>
    [HttpPost]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<ServiceResponse<bool>> SaveSettings([FromBody]PobeditSettingsDto pobeditSettingsDto)
    {
        var response = _settingsService.SaveSettings(pobeditSettingsDto);
        if (!response.Success)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        return Ok(response);
    }
}
