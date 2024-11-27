using AutoMapper;
using Gather.Data;
using SharedCore.Dtos.User;
using Microsoft.EntityFrameworkCore;
using SharedCore.Models;
using System.Net;
using System.Collections;
using SharedCore.Dtos.Channel;

namespace Gather.Services.UserService
{
    public class UserService : IUserService
    {
        ILogger _logger;
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public UserService(IMapper mapper, DataContext context, ILogger<UserService> logger)
        {
            _mapper = mapper;
            _context = context;
            _logger = logger;
        }

        public async Task<ServiceResponse<GetUserDto>> GetUserIdAsync(int id)
        {
            var response = new ServiceResponse<GetUserDto>();
            try
            {
                var dbUser = await _context.Users.FirstOrDefaultAsync(c => c.UserId == id);
                if (dbUser == null)
                {
                    response.Message = "User not found";
                }
                else
                {
                    response.Data = _mapper.Map<GetUserDto>(dbUser);
                }
            }
            catch (Exception ex)
            {
                response.Message = "Server error";
                response.Success = false;
                _logger.Log(LogLevel.Error, ex.Message);
            }
            return response;
        }

        public async Task<ServiceResponse<IEnumerable<GetUserDto>>> GetAllUsersAsync()
        {
            var response = new ServiceResponse<IEnumerable<GetUserDto>>();
            try
            {
                var dbUsers = await _context.Users.ToListAsync();
                response.Data = dbUsers.Select(a => _mapper.Map<GetUserDto>(a)).ToList();
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Data = Enumerable.Empty<GetUserDto>();
                response.Message = "Server error";
                return response;
            }
        }

        public async Task<ServiceResponse<int>> AddUserAsync(AddUserDto newUser)
        {
            var response = new ServiceResponse<int>();
            User? userFromDb = await _context.Users
                .FirstOrDefaultAsync(a => a.Password == newUser.Password && a.Username == newUser.Username);
            if (userFromDb != null)
            {
                response.Success = false;
                response.Message = "User already exists";
                return response;
            }

            try
            {
                User user = _mapper.Map<User>(newUser);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                response.Data = _context.Users
                    .Where(a => a.Password == user.Password && a.Username == user.Username)
                    .Select(a => _mapper.Map<GetUserDto>(a).UserId).First();
                response.Success = true;
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "An error occurred while creating the user";
                _logger.Log(LogLevel.Error, ex.Message);
                return response;
            }
        }

        public async Task<ServiceResponse<GetUserDto>> DeleteUserAsync(int id)
        {
            ServiceResponse<GetUserDto> response = new ServiceResponse<GetUserDto>();

            try
            {
                User? user = await _context.Users
                    .FirstOrDefaultAsync(c => c.UserId == id);
                if (user != null)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                    response.Data = _mapper.Map<GetUserDto>(user);
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "An error occurred while deleting the user";
                _logger.Log(LogLevel.Error, ex.Message);
                return response;
            }
        }

        public async Task<ServiceResponse<GetUserDto>> EditUserAsync(User userParam)
        {
            var response = new ServiceResponse<GetUserDto>();

            try
            {
                User? userInDb = await _context.Users
                    .FirstOrDefaultAsync(a => a.UserId == userParam.UserId);

                if (_context.Users.Any(a => a.Username == userParam.Username && userInDb.UserId != userParam.UserId))
                {
                    response.Success = false;
                    response.Message = " with this username already exists";
                }
                else if (_context.Users.Any(a => a.PhoneNumber == userParam.PhoneNumber && userInDb.UserId != userParam.UserId))
                {
                    response.Success = false;
                    response.Message = "User with this phone number already exists";
                }
                else if (userInDb == null)
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
                else
                {
                    userInDb.Password = userParam.Password;
                    userInDb.Username = userParam.Username;
                    userInDb.PhoneNumber = userParam.PhoneNumber;

                    await _context.SaveChangesAsync();
                    response.Data = _mapper.Map<GetUserDto>(userInDb);
                    response.Success = true;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Фn error occurred while editing the user";
                _logger.Log(LogLevel.Error, ex.Message);
            }

            return response;
        }
    }
}
