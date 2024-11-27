using SharedCore.Models;

namespace Gather.Data
{
    public interface IAuthRepository
    {
        Task<ServiceResponse<int>> Register(Account account, string password);
        Task<ServiceResponse<string>> Login(string username, string password);
        
    }
}
