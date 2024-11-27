using Asp.Versioning;
using Gather.Services.UserService;
using Microsoft.AspNetCore.Mvc;
using SharedCore.Dtos.User;
using SharedCore.Filtering;
using SharedCore.Models;

namespace Gather.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<List<GetUserDto>>>> Get()
        {
            return Ok(await _userService.GetAllUsersAsync());
        }

        [HttpGet("{id}")]
        [MapToApiVersion(1.0)]
        [ServiceFilter(typeof(IdFilter))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> GetSingle([FromRoute] int id)
        {
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

        [HttpPost]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Add(AddUserDto user)
        {
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

        [HttpDelete("{id}")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Delete(int id)
        {
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

        [HttpPatch]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Edit(User user)
        {
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
    }
}
