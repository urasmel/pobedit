﻿using Gather.Dtos;
using Gather.Models;

namespace Gather.Services.Users;

public interface IUserService
{
    Task<ServiceResponse<IEnumerable<GetUserDto>>> GetAllUsersAsync();

    Task<ServiceResponse<GetUserDto>> GetUserIdAsync(int id);

    Task<ServiceResponse<int>> AddUserAsync(AddUserDto newUser);

    Task<ServiceResponse<GetUserDto>> DeleteUserAsync(int id);

    Task<ServiceResponse<GetUserDto>> EditUserAsync(User user);
}
