using ControlService.Dtos.Account;
using ControlService.Models;
using SharedCore.Models;

namespace ControlService.Services.UserService
{
    public interface IUserService
    {
        Task<ServiceResponse<List<GetUserDto>>> GetAllUsersAsync();
        Task<ServiceResponse<GetUserDto>> GetUserIdAsync(int id);
        Task<ServiceResponse<int>> AddUserAsync(AddUserDto newUser);
        Task<ServiceResponse<GetUserDto>> DeleteUserAsync(int id);
        Task<ServiceResponse<GetUserDto>> EditUserAsync(User user);
    }
}
