using ControlService.Dtos.Account;
using ControlService.Models;
using ControlService.Services.AccountService;
using Microsoft.AspNetCore.Mvc;
using SharedCore.Model;

namespace ControlService.Controllers
{
    [ApiController]
    [Route("account")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("all")]
        public async Task<ActionResult<ServiceResponse<List<GetAccountDto>>>> Get()
        {
            return Ok(await _accountService.GetAllAccounts());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<GetAccountDto>>> GetSingle(int id)
        {
            return Ok(await _accountService.GetAccountById(id));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<GetAccountDto>>> Add(AddAccountDto newAccount)
        {
            return Ok(await _accountService.AddAccount(newAccount));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<GetAccountDto>>> Delete(int id)
        {
            var response = await _accountService.DeleteAccount(id);

            if (response.Data == null)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpPatch]
        public async Task<ActionResult<ServiceResponse<GetAccountDto>>> Edit(SharedCore.Model.Account account)
        {
            var response = await _accountService.EditAccount(account);

            if (response.Data == null)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
    }
}
