using AutoMapper;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Microsoft.EntityFrameworkCore;

namespace Gather.Services.AccountService;

public class AccountService : IAccountService
{
    private readonly IMapper _mapper;
    private readonly DataContext _context;
    private readonly ILogger<AccountService> _logger;

    public AccountService(IMapper mapper, DataContext context, ILogger<AccountService> logger)
    {
        _mapper = mapper;
        _context = context;
        _logger = logger;
    }

    public async Task<ServiceResponse<AccountDto>> GetAccountAsync(long accountTlgId)
    {
        var response = new ServiceResponse<AccountDto>();

        if (_context.Accounts == null)
        {
            response.Message = "Internal server error";
            response.Success = false;
            response.Data = null;
            return response;
        }

        try
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(acc => acc.TlgId == accountTlgId);
            if (account == null)
            {
                response.Message = "Account not found";
                response.Success = false;
            }
            else
            {
                response.Data = _mapper.Map<AccountDto>(account);
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

    public async Task<ServiceResponse<IEnumerable<CommentDto>>> GetCommentsAsync(long accountTlgId, int offset = 0, int count = 20)
    {
        var response = new ServiceResponse<IEnumerable<CommentDto>>();

        if (_context.Accounts == null || _context.Comments == null)
        {
            response.Message = "Internal server error";
            response.Success = false;
            response.Data = null;
            return response;
        }

        try
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(acc => acc.TlgId == accountTlgId);
            if (account == null)
            {
                response.Message = "Account not found";
                response.Success = false;
            }
            else
            {
                var comments = await _context.Comments.Where(c => c.From.TlgId == accountTlgId)
                    .OrderByDescending(item => item.TlgId)
                    .Skip(offset).Take(count)
                    .ToListAsync();
                response.Data = _mapper.Map<IEnumerable<CommentDto>>(comments);
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

    public async Task<ServiceResponse<int>> GetCommentsCountAsync(long accountTlgId)
    {
        var response = new ServiceResponse<int>();

        if (_context.Accounts == null || _context.Comments == null)
        {
            response.Message = "Internal server error";
            response.Success = false;
            response.Data = 0;
            return response;
        }

        try
        {
            var commentsCount = await _context.Comments.Where(c => c.From.TlgId == accountTlgId).CountAsync();
            response.Data = commentsCount;
        }
        catch (Exception ex)
        {
            response.Message = "Server error";
            response.Success = false;
            _logger.Log(LogLevel.Error, ex.Message);
        }
        return response;
    }
}
