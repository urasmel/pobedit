using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.AccountService;
using Microsoft.AspNetCore.Mvc;

namespace Gather.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class AccountsController:ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("{accountTlgId}")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<AccountDto>>> GetSingle([FromRoute] long accountTlgId)
        {
            var response = await _accountService.GetAccountAsync(accountTlgId);
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

        [HttpGet("{accountTlgId}/comments")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<IEnumerable<CommentDto>>>> GetComments([FromRoute] long accountTlgId, int offset = 0, int count = 20)
        {
            var response = await _accountService.GetCommentsAsync(accountTlgId, offset, count);
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
    }
}
