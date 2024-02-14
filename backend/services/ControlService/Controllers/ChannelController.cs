using ControlService.Dtos.Account;
using ControlService.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControlService.Controllers
{
    [Route("channel")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        [HttpGet("all")]
        public ActionResult<ServiceResponse<bool>> Get()
        {
            var response = new ServiceResponse<bool>();
            response.Data = true;
            return Ok(response);
        }

        [HttpGet("fromAccount/{id}")]
        public ActionResult<ServiceResponse<bool>> GetChannelsByAccountId()
        {
            var response = new ServiceResponse<bool>();
            response.Data = true;
            return Ok(response);
        }
    }
}
