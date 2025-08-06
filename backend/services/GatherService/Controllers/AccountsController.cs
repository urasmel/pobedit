using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services.Accounts;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class AccountsController : ControllerBase
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
            Log.Information("Single account requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetSingle"
                }
            );

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

        [HttpGet()]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<AccountDto>>> GetAll(
            [FromQuery] int offset = 0,
            [FromQuery] int limit = 20,
            [FromQuery] TrackingOptionsDto is_tracking = TrackingOptionsDto.All,
            [FromQuery] string login = "")
        {
            Log.Information("Accounts requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetAll"
                }
            );

            var response = await _accountService.GetAccountsAsync(offset, limit, is_tracking, login);
            if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }

            return Ok(response);
        }

        [HttpGet("count")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<int>>> GetCount(
            [FromQuery] TrackingOptionsDto is_tracking = TrackingOptionsDto.All, 
            [FromQuery] string login = "")
        {
            Log.Information("Accounts count requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetCount"
                }
            );

            var response = await _accountService.GetCountAsync(is_tracking, login);
            if (!response.Success)
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
            Log.Information("Update account requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "Update"
                }
            );

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
        public async Task<ActionResult<ServiceResponse<IEnumerable<CommentDto>>>> GetComments(
            [FromRoute] long accountTlgId, 
            [FromQuery] int offset = 0, 
            [FromQuery] int limit = 20)
        {
            Log.Information("Account comments requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetComments"
                }
            );

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
            Log.Information("Account comments count requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "GetCommentsCount"
                }
            );

            var response = await _accountService.GetCommentsCountAsync(accountTlgId);
            if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }

            return Ok(response);
        }

        [HttpPost("{accountTlgId}/change_tracking")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<bool>>> ChangeTracking([FromRoute] long accountTlgId, [FromBody] ChangeTrackingDto trackingDto)
        {
            Log.Information("Changing account tracking requested at {Time}",
                DateTime.Now,
                new
                {
                    method = "ChangeTracking"
                }
            );

            var response = await _accountService.ChangeTracking(accountTlgId, trackingDto.IsTracking);
            if (!response.Success)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }

            return Ok(response);
        }
    }
}
