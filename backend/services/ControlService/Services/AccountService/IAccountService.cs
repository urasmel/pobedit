using ControlService.Dtos.Account;
using ControlService.Models;

namespace ControlService.Services.AccountService
{
    public interface IAccountService
    {
        Task<ServiceResponse<List<GetAccountDto>>> GetAllAccounts();
        Task<ServiceResponse<GetAccountDto>> GetAccountById(int id);
        Task<ServiceResponse<int>> AddAccount(AddAccountDto newAccount);
        Task<ServiceResponse<GetAccountDto>> DeleteAccount(int id);
        Task<ServiceResponse<GetAccountDto>> EditAccount(Account account);
    }
}
