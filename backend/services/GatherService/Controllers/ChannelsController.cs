using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.Channels;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TL;

namespace Gather.Controllers;


[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class ChannelsController(IChannelsService channelsService) : ControllerBase
{
    private readonly IChannelsService _channelsService = channelsService;

    /// <summary>
    /// Возвращает каналы пользователя по его username, которые есть в БД.
    /// </summary>
    [HttpGet]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ServiceResponse<IEnumerable<ChannelDto>>>> GetAllChannels()
    {
        Log.Information("All channels requested at {Time}",
                DateTime.Now,
            new
            {
                method = "GetAllChannels"
            }
        );

        var response = await _channelsService.GetAllChannels();
        if (!response.Success)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        return Ok(response);
    }

    /// <summary>
    /// Возвращает каналы пользователя по его username, запрашивая API телеграмма, одновляет их в БД и возвращает в ответе запроса.
    /// </summary>
    [HttpGet]
    [Route("update")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ServiceResponse<IEnumerable<ChatBase>>>> GetAllUpdatedChannels()
    {
        Log.Information("Updating channels requested at {Time}",
                DateTime.Now,
            new
            {
                method = "GetAllUpdatedChannels"
            }
        );

        var response = await _channelsService.UpdateChannels();
        if (!response.Success)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        return Ok(response);
    }

    /// <summary>
    /// Возвращает информацию о канале пользователя.
    /// </summary>
    /// <param name="channelId">ID канала</param>
    [HttpGet]
    [Route("{channelId}/info")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ChannelDto>> GetChannelInfo(long channelId)
    {
        Log.Information("Channel info requested at {Time}",
                DateTime.Now,
            new
            {
                method = "GetChannelInfo"
            }
        );

        var response = await _channelsService.GetChannelInfo(channelId);
        if (response.Message == "Channel not found")
        {
            return NotFound(response);
        }

        if (!response.Success)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        return Ok(response);
    }

    [HttpPost]
    [Route("{channelId}/update")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ChannelDto>> UpdateChannelInfo(long channelId)
    {
        Log.Information("Updating channel info requested at {Time}",
                DateTime.Now,
            new
            {
                method = "UpdateChannelInfo"
            }
        );

        var response = await _channelsService.UpdateChannelInfo(channelId);
        if (response.Message == "Channel not found")
        {
            return NotFound(response);
        }

        if (!response.Success)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

        return Ok(response);
    }
}
