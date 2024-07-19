using AutoMapper;
using ControlService.Data;
using SharedCore.Dtos.User;
using Microsoft.EntityFrameworkCore;
using SharedCore.Models;

namespace ControlService.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public UserService(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<ServiceResponse<GetUserDto>> GetUserIdAsync(int id)
        {
            var serviceResponse = new ServiceResponse<GetUserDto>();
            var dbUser = await _context.Users
                .FirstOrDefaultAsync(c => c.UserId == id);
            serviceResponse.Data = _mapper.Map<GetUserDto>(dbUser);
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetUserDto>>> GetAllUsersAsync()
        {
            var response = new ServiceResponse<List<GetUserDto>>();
            var dbUsers = await _context.Users.ToListAsync();
            response.Data = dbUsers.Select(a => _mapper.Map<GetUserDto>(a)).ToList();
            return response;
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
            }
            else
            {
                User user = _mapper.Map<User>(newUser);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                response.Data = _context.Users
                    .Where(a => a.Password == user.Password && a.Username == user.Username)
                    .Select(a => _mapper.Map<GetUserDto>(a).Id).First();
                response.Success = true;
            }

            return response;
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
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<GetUserDto>> EditUserAsync(User userParam)
        {
            var response = new ServiceResponse<GetUserDto>();

            try
            {
                User? userInDb = await _context.Users
                    .FirstOrDefaultAsync(a => a.UserId == userParam.UserId);

                if (_context.Users.Any(a => a.Username == userParam.Username && userInDb.UserId!=userParam.UserId))
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
                response.Message = ex.Message;
            }

            return response;
        }
    }
}
