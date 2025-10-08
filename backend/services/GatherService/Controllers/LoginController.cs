using Gather.Dtos;
using Gather.Models;
using Gather.Services.Login;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers
{
    [ApiController]
    [Route("login")]
    public class LoginController(ILoginService loginService, RequestMetrics metrics) : ControllerBase
    {
        private readonly ILoginService _loginService = loginService;
        private readonly RequestMetrics _metrics = metrics;

        [HttpPost("/login")]
        public async Task<ActionResult<ServiceResponse<int>>> Login(LoginDto loginDto)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("Login requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Login"
                    }
                );

                var response = await _loginService.Login(loginDto);
                if (!response.Success)
                {
                    return BadRequest(response);
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
// TODO общие модели и дтошки в проект библиотеки классов