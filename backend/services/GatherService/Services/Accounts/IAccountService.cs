using Gather.Dtos;
using Gather.Models;

namespace Gather.Services.Accounts;

public interface IAccountService
{
    Task<ServiceResponse<AccountDto>> GetAccountAsync(long accountTlgId);

    Task<ServiceResponse<IEnumerable<CommentDto>>> GetCommentsAsync(long accountTlgId, int offset, int limit);

    Task<ServiceResponse<int>> GetCommentsCountAsync(long accountTlgId);

    Task<ServiceResponse<AccountDto>> UpdateAccountAsync(long accountTlgId);

    Task<ServiceResponse<bool>> ChangeTracking(long accountTlgId, bool tracking);
}
