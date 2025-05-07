using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.Accounts;
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
            else if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }

        [HttpGet("{accountTlgId}/update")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<AccountDto>>> Update([FromRoute] long accountTlgId)
        {
            var response = await _accountService.UpdateAccountAsync(accountTlgId);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            else if (!response.Success)
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
        public async Task<ActionResult<ServiceResponse<IEnumerable<CommentDto>>>> GetComments([FromRoute] long accountTlgId,[FromQuery] int offset = 0, [FromQuery] int limit = 20)
        {
            var response = await _accountService.GetCommentsAsync(accountTlgId, offset, limit);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            else if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }

        [HttpGet("{accountTlgId}/comments_count")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<int>>> GetCommentsCount([FromRoute] long accountTlgId)
        {
            var response = await _accountService.GetCommentsCountAsync(accountTlgId);
            if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
    }
}
