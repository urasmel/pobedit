using ControlService.Models;
using SharedCore.Models;

namespace ControlService.Data
{
    public class AuthRepository : IAuthRepository
    {
        public Task<ServiceResponse<string>> Login(string username, string password)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResponse<int>> Register(Account account, string password)
        {
            throw new NotImplementedException();
        }
    }
}
