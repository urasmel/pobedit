using Asp.Versioning;
using Gather.Dtos;
using Gather.Services.Channels;
using Gather.Services.Comments;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class CommentsController(ICommentsService commentsService, RequestMetrics metrics) : ControllerBase
    {
        private readonly ICommentsService _commentsService = commentsService;
        private readonly RequestMetrics _metrics = metrics;

        [HttpGet]
        [Route("{channelId}/{postId}")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<CommentDto>>> GetAllPostComments(long channelId, long postId, int offset = 0, int count = 20)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("All post's comments requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "GetAllPostComments"
                    }
                );
                var response = await _commentsService.GetComments(channelId, postId, offset, count);

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
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }

        [HttpGet()]
        [Route("{channelId}/{postId}/update")]
        public async Task UpdatePostComments(long channelId, long postId)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("Updating post's comments requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "UpdatePostComments"
                    }
                );

                if (HttpContext.WebSockets.IsWebSocketRequest)
                {
                    using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                    await _commentsService.UpdatePostComments(channelId, postId, webSocket);
                }
                else
                {
                    HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                }
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }

        [HttpGet]
        [Route("{channelId}/{postId}/count")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<long>> GetPostCommentsCount(long channelId, long postId)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("Post's comments count requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "GetPostCommentsCount"
                    }
                );

                var response = await _commentsService.GetCommentsCount(channelId, postId);

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
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }
    }
}
