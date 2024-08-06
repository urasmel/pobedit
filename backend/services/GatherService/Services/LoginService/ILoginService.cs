using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using SharedCore.Models;

namespace GatherMicroservice.Services
{
    public interface ILoginService
    {
        Task<ServiceResponse<long>> Login(LoginDto loginData);
    }
}
