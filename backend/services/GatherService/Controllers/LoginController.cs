using Microsoft.AspNetCore.Mvc;
using GatherMicroservice.Models;
using GatherMicroservice.Dtos;
using GatherMicroservice.Services;

namespace GatherMicroservice.Controllers
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

        [HttpGet("/login")]
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