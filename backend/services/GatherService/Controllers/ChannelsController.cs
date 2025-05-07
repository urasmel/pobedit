using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.Channels;
using Microsoft.AspNetCore.Mvc;
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
    [Route("updated_channels")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ServiceResponse<List<ChatBase>>>> GetAllUpdatedChannels()
    {
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

    /// <summary>
    /// Возвращает посты канала, которые есть в БД, по его id.
    /// </summary>
    /// <param name="channelId">Идентификатор канала</param>
    /// <param name="offset">Смещение относительно последнего сообщения данного канала, находящегося в базе</param>
    /// <param name="count">Количество записей, которые необходимо вернуть</param>
    [HttpGet]
    [Route("{channelId}/posts")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<PostDto>>> GetAllChannelPosts(long channelId, int offset = 0, int count = 20)
    {
        var response = await _channelsService.GetChannelPosts(channelId, offset, count);

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

    [HttpGet]
    [Route("{channelId}/posts/{postId}")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PostDto>> GetAllChannelPosts(long channelId, long postId)
    {
        var response = await _channelsService.GetChannelPost(channelId, postId);

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


    [HttpGet]
    [Route("{channelId}/posts_count")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<long>> GetChannelPostsCount(long channelId)
    {
        var response = await _channelsService.GetChannelPostsCount(channelId);

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

    [HttpGet()]
    [Route("{channelId}/update_posts")]
    public async Task UpdateChannelPosts(long channelId)
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await _channelsService.UpdateChannelPosts(channelId, webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }



    [HttpGet]
    [Route("{channelId}/posts/{postId}/comments")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<CommentDto>>> GetAllPostComments(long channelId, long postId, int offset = 0, int count = 20)
    {
        var response = await _channelsService.GetComments(channelId, postId, offset, count);

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

    [HttpGet()]
    [Route("{channelId}/posts/{postId}/update_comments")]
    public async Task UpdatePostComments(long channelId, long postId)
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await _channelsService.UpdatePostComments(channelId, postId, webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    [HttpGet]
    [Route("{channelId}/posts/{postId}/comments_count")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<long>> GetPostCommentsCount(long channelId, long postId)
    {
        var response = await _channelsService.GetCommentsCount(channelId, postId);

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
