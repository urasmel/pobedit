using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Microsoft.EntityFrameworkCore;
using TL;
using WTelegram;

namespace Gather.Services.AccountService;

public class AccountService(GatherClient client, IMapper mapper, DataContext context, ILogger<AccountService> logger) : IAccountService
{
    private readonly IMapper _mapper = mapper;
    private readonly DataContext _context = context;
    private readonly ILogger<AccountService> _logger = logger;
    readonly GatherClient _client = client;
    TL.User? user;


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

    public async Task<ServiceResponse<AccountDto>> UpdateAccountAsync(long accountTlgId)
    {
        var response = new ServiceResponse<AccountDto>();

        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception,
                "UpdateAccountAsync" +
                Environment.NewLine +
                "The error while logging telegram user.");

            response.Success = false;
            response.Message = "Unable to login to Telegram";
            response.Data = null;
            return response;
        }

        try
        {
            //var user = _client.User;
            //Console.WriteLine($"User ID: {user.ID}, Username: {user.username}, First Name: {user.first_name}, Last Name: {user.last_name}");

            //long userId = accountTlgId;

            //var account = await _context.Accounts.FirstOrDefaultAsync(acc => acc.TlgId == userId);
            //if (account == null || account.AccessHash == null)
            //{
            //    response.Message = "Account not found or access hash is missing";
            //    response.Success = false;
            //    return response;
            //}

            //var targetUser = await _client.Invoke(new TL.Methods.Users_GetFullUser
            //{
            //    id = new InputUser { user_id = userId, access_hash = account.AccessHash.Value }
            //});

            var comment = await _context.Comments.Where(c => c.From.TlgId == accountTlgId).FirstAsync();
            long commentId = comment.TlgId;
            var peerId = comment.PeerId;

            InputPeer inputPeer = new InputPeerChat(peerId);
            var inputUserFromMessage = new InputUserFromMessage()
            {
                peer = inputPeer,
                msg_id = (int)comment.TlgId,
                user_id = accountTlgId
            };

            var fullUser = await _client.Users_GetFullUser(inputUserFromMessage);
            var acc = _mapper.Map<AccountDto>(fullUser.users.First().Value);
            response.Data = acc;
            return response;
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = "Server error";
            _logger.Log(LogLevel.Error, ex.Message);
            return response;

        }
        finally
        {
            //_client.Dispose(); // Dispose the client when done
        }
    }
}
