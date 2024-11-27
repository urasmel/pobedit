using Gather.Dtos;
using Gather.Models;
using SharedCore.Models;

namespace Gather.Services
{
    public interface ILoginService
    {
        Task<ServiceResponse<long>> Login(LoginDto loginData);
    }
}
