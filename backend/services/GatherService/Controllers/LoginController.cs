using Microsoft.AspNetCore.Mvc;
using Gather.Models;
using Gather.Dtos;
using Gather.Services;
using SharedCore.Models;

namespace Gather.Controllers
{
    [ApiController]
    [Route("login")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("/login")]
        public async Task<ActionResult<ServiceResponse<int>>> Login(LoginDto loginDto)
        {
            var response = await _loginService.Login(loginDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
// TODO общие модели и дтошки в проект библиотеки классов
// apiid and apihash хранить в конфиге