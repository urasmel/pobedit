using ControlMicroservice.Filtering;
using ControlService.Models;
using ControlService.Services.UserService;
using Microsoft.AspNetCore.Mvc;
using SharedCore.Dtos.User;
using SharedCore.Models;

namespace ControlService.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<GetUserDto>>>> Get()
        {
            return Ok(await _userService.GetAllUsersAsync());
        }

        [HttpGet("{id}")]
        [ServiceFilter(typeof(IdNumberFilter))]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> GetSingle([FromRoute] int id)
        {
            return Ok(await _userService.GetUserIdAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Add(AddUserDto newUser)
        {
            return Ok(await _userService.AddUserAsync(newUser));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Delete(int id)
        {
            var response = await _userService.DeleteUserAsync(id);

            if (response.Data == null)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpPatch]
        public async Task<ActionResult<ServiceResponse<GetUserDto>>> Edit(User user)
        {
            var response = await _userService.EditUserAsync(user);

            if (response.Data == null)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
    }
}
