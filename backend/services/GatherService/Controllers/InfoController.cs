using Asp.Versioning;
using Gather.Services;
using Microsoft.AspNetCore.Mvc;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Models;
using TL;

namespace Gather.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class InfoController : ControllerBase
{
    private readonly IInfoService _infoService;

    public InfoController(IInfoService infoService)
    {
        _infoService = infoService;
    }

    /// <summary>
    /// Возвращает каналы пользователя по его username, которые есть в БД.
    /// </summary>
    [HttpGet]
    [Route("channels")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ServiceResponse<IEnumerable<ChannelDto>>>> GetAllChannels()
    {
        var response = await _infoService.GetAllChannels();
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
        var response = await _infoService.UpdateChannels();
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
    [Route("channels/{channelId}/info")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ChannelDto>> GetChannelInfo(long channelId)
    {
        var response = await _infoService.GetChannelInfo(channelId);
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
    [Route("channels/{channelId}/posts")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<PostDto>>> GetAllChannelPosts(long channelId, int offset = 0, int count = 20)
    {
        var response = await _infoService.GetChannelPosts(channelId, offset, count);

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
    [Route("channels/{channelId}/posts_count")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<PostDto>>> GetChannelPostsCount(long channelId)
    {
        var response = await _infoService.GetChannelPostsCount(channelId);

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
    /// Скачивает в базу данных новые сообщения канала, которые появились после последнего сообщения канала, содержащегося в базе данных.
    /// Если в базе данных нет записей канала, то загружаются все записи начиная с 31.12.2023.
    /// </summary>
    /// <param name="channelId">Идентификатор канала</param>
    //[HttpGet]
    //[Route("users/{user}/channels/{channelId}/updated_messages")]
    //[MapToApiVersion(1.0)]
    //[ServiceFilter(typeof(UserFilter))]
    //[ProducesResponseType(StatusCodes.Status200OK)]
    //[ProducesResponseType(StatusCodes.Status404NotFound)]
    //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult<List<PostDto>>> UpdateAndFetchChannelPosts(string user, int channelId)
    //{
    //    var response = await _infoService.UpdateChannelPosts(user, channelId);

    //    if (response.Message == "User not found" || response.Message == "Channel not found")
    //    {
    //        return NotFound(response);
    //    }

    //    if (!response.Success)
    //    {
    //        return StatusCode(StatusCodes.Status500InternalServerError, response);
    //    }

    //    return Ok(response);
    //}

    [HttpGet()]
    [Route("channels/{channelId}/update_posts")]
    public async Task UpdateChannelPosts(long channelId)
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await _infoService.UpdateChannelPosts(channelId, webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    [HttpGet]
    [Route("channels/{channelId}/posts/{postId}/comments")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<PostDto>>> GetAllPostComments(long channelId, long postId, int offset = 0, int count = 20)
    {
        var response = await _infoService.GetComments(channelId, postId, offset, count);

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
    [Route("channels/{channelId}/posts/{postId}/update_comments")]
    public async Task UpdatePostComments(long channelId, long postId)
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await _infoService.UpdatePostComments(channelId, postId, webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

}


// TODO общие модели и дтошки в проект библиотеки классов
// apiid and apihash хранить в конфиге