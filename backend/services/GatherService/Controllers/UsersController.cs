using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.Users;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SharedCore.Filtering;

namespace Gather.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly RequestMetrics _metrics;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, RequestMetrics metrics, ILogger<UsersController> logger)
        {
            _userService = userService;
            _metrics = metrics;
            _logger = logger;
        }

        [HttpGet]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<IEnumerable<GetUserDto>>>> Get()
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("All users requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Get"
                    }
                );

                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }

        [HttpGet("{id}")]
        [MapToApiVersion(1.0)]
        [ServiceFilter(typeof(IdFilter))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> GetSingle([FromRoute] int id)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("User requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "GetSingle"
                    }
                );

                var response = await _userService.GetUserIdAsync(id);
                if (response.Data == null)
                {
                    return NotFound(response);
                }
                else if (response.Success == false)
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

        [HttpPost]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Add(AddUserDto user)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("User adding requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Add"
                    }
                );

                var response = await _userService.AddUserAsync(user);
                if (response.Data == 0)
                {
                    return NotFound(response);
                }
                else if (response.Message == "User already exists")
                {
                    return Conflict(response);
                }
                else if (response.Success == false)
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

        [HttpDelete("{id}")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Delete(int id)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("User deleting requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Delete"
                    }
                );

                var response = await _userService.DeleteUserAsync(id);

                if (response.Success == false)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
                }
                if (response.Data == null)
                {
                    return NotFound(response);
                }

                return Ok(response);
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }

        [HttpPatch]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Edit(User user)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("User editing requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Edit"
                    }
                );

                var response = await _userService.EditUserAsync(user);

                if (response.Success == false)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
                }
                if (response.Data == null)
                {
                    return NotFound(response);
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
