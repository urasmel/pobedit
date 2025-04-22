using Gather.Dtos;
using Gather.Models;

namespace Gather.Services.AccountService;

public interface IAccountService
{
    Task<ServiceResponse<AccountDto>> GetAccountAsync(long accountTlgId);
}
