using Gather.Dtos;
using Gather.Models;

namespace Gather.Services.AccountService;

public interface IAccountService
{
    Task<ServiceResponse<AccountDto>> GetAccountAsync(long accountTlgId);

    Task<ServiceResponse<IEnumerable<CommentDto>>> GetCommentsAsync(long accountTlgId, int offset, int limit);

    Task<ServiceResponse<int>> GetCommentsCountAsync(long accountTlgId);
}
