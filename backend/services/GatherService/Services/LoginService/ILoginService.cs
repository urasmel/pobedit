using GatherMicroservice.Dtos;
using GatherMicroservice.Models;

namespace GatherMicroservice.Services
{
    public interface ILoginService
    {
        Task<ServiceResponse<long>> Login(LoginDto loginData);
    }
}
