using AutoMapper;
using Gather.Data;
using Microsoft.EntityFrameworkCore;
using Gather.Models;
using Gather.Dtos;

namespace Gather.Services.Users;

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

        if (_context.Users == null)
        {
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            response.Success = false;
            response.Data = null;
            return response;
        }

        try
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(c => c.UserId == id);
            if (dbUser == null)
            {
                response.Message = "User not found";
                response.ErrorType = ErrorType.NotFound;
            }
            else
            {
                response.Data = _mapper.Map<GetUserDto>(dbUser);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            response.Success = false;
        }
        return response;
    }

    public async Task<ServiceResponse<IEnumerable<GetUserDto>>> GetAllUsersAsync()
    {
        var response = new ServiceResponse<IEnumerable<GetUserDto>>();

        if (_context.Users == null)
        {
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            response.Success = false;
            response.Data = null;
            return response;
        }

        try
        {
            var dbUsers = await _context.Users.ToListAsync();
            response.Data = dbUsers.Select(a => _mapper.Map<GetUserDto>(a)).ToList();
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            response.Success = false;
            response.Data = Enumerable.Empty<GetUserDto>();
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            return response;
        }
    }

    public async Task<ServiceResponse<int>> AddUserAsync(AddUserDto newUser)
    {
        var response = new ServiceResponse<int>();

        if (_context.Users == null)
        {
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            response.Success = false;
            response.Data = 0;
            return response;
        }

        User? userFromDb = await _context.Users
            .FirstOrDefaultAsync(a => a.Password == newUser.Password && a.Username == newUser.Username);
        if (userFromDb != null)
        {
            response.Success = false;
            response.Message = "User already exists";
            response.ErrorType = ErrorType.AlreadyExists;
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
            _logger.LogError(ex.Message);
            response.Success = false;
            response.Message = "An error occurred while creating the user";
            response.ErrorType = ErrorType.ServerError;
            return response;
        }
    }

    public async Task<ServiceResponse<GetUserDto>> DeleteUserAsync(int id)
    {
        ServiceResponse<GetUserDto> response = new ServiceResponse<GetUserDto>();

        try
        {
            if (_context.Users == null)
            {
                response.Success = false;
                response.Message = "Server error";
                response.ErrorType = ErrorType.ServerError;
                return response;
            }

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
                response.ErrorType = ErrorType.NotFound;
            }
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            response.Success = false;
            response.Message = "An error occurred while deleting the user";
            response.ErrorType = ErrorType.ServerError;
            return response;
        }
    }

    public async Task<ServiceResponse<GetUserDto>> EditUserAsync(User userParam)
    {
        var response = new ServiceResponse<GetUserDto>();

        try
        {
            if (_context.Users == null)
            {
                response.Success = false;
                response.Message = "Server error";
                response.ErrorType = ErrorType.ServerError;
                return response;
            }

            User? userInDb = await _context.Users
                .FirstOrDefaultAsync(a => a.UserId == userParam.UserId);

            if (userInDb == null)
            {
                response.Success = false;
                response.Message = "User not found";
                response.ErrorType = ErrorType.NotFound;
                return response;
            }

            if (_context.Users.Any(a => a.Username == userParam.Username && userInDb.UserId != userParam.UserId))
            {
                response.Success = false;
                response.Message = "User with this username already exists";
                response.ErrorType = ErrorType.AlreadyExists;
            }
            else if (_context.Users.Any(a => a.PhoneNumber == userParam.PhoneNumber && userInDb.UserId != userParam.UserId))
            {
                response.Success = false;
                response.Message = "User with this phone number already exists";
                response.ErrorType = ErrorType.AlreadyExists;
            }
            else if (userInDb == null)
            {
                response.Success = false;
                response.Message = "User not found";
                response.ErrorType = ErrorType.NotFound;
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
            _logger.LogError(ex.Message);
            response.Success = false;
            response.Message = "An error occurred while editing the user";
            response.ErrorType = ErrorType.ServerError;
        }

        return response;
    }
}
