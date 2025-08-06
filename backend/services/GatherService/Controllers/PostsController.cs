using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.Posts;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class PostsController(IPostsService postsService) : ControllerBase
    {
        private readonly IPostsService _postsService = postsService;

        /// <summary>
        /// Возвращает посты канала, которые есть в БД, по его id.
        /// </summary>
        /// <param name="channelId">Идентификатор канала</param>
        /// <param name="offset">Смещение относительно последнего сообщения данного канала, находящегося в базе</param>
        /// <param name="count">Количество записей, которые необходимо вернуть</param>
        [HttpGet]
        [Route("{channelId}")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<PostDto>>> GetAllChannelPosts(long channelId, int offset = 0, int count = 20)
        {
            Log.Information("All channel's posts requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetAllChannelPosts"
                }
            );

            var response = await _postsService.GetChannelPosts(channelId, offset, count);

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
        [Route("{channelId}/{postId}")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PostDto>> GetChannelPost(long channelId, long postId)
        {
            Log.Information("Channel's post requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetChannelPost"
                }
            );

            var response = await _postsService.GetChannelPost(channelId, postId);

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
        [Route("{channelId}/count")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<long>> GetChannelPostsCount(long channelId)
        {
            Log.Information("Channel's posts count requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetChannelPostsCount"
                }
            );
            var response = await _postsService.GetChannelPostsCount(channelId);

            if (response.ErrorType == ErrorType.NotFound)
            {
                return NotFound(response);
            }
            else if (!response.Success)
            {
                StatusCode(StatusCodes.Status500InternalServerError, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("{channelId}/update")]
        public async Task UpdateChannelPosts(long channelId)
        {
            Log.Information("Updating channel's posts requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "UpdateChannelPosts"
                }
            );

            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await _postsService.UpdateChannelPosts(channelId, webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }
    }
}
