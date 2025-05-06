using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.InfoService;
using Microsoft.AspNetCore.Mvc;
using TL;

namespace Gather.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Produces("application/json")]
[Route("api/v{v:apiVersion}/[controller]")]
public class InfoController(IInfoService infoService) : ControllerBase
{
    private readonly IInfoService _infoService = infoService;

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



    [HttpGet]
    [Route("channels/{channelId}/posts/{postId}/comments")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<CommentDto>>> GetAllPostComments(long channelId, long postId, int offset = 0, int count = 20)
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

    [HttpGet]
    [Route("channels/{channelId}/posts/{postId}/comments_count")]
    [MapToApiVersion(1.0)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<long>> GetPostCommentsCount(long channelId, long postId)
    {
        var response = await _infoService.GetCommentsCount(channelId, postId);

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


// TODO общие модели и дтошки в проект библиотеки классов
// apiid and apihash хранить в конфиге