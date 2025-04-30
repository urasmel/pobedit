using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Microsoft.EntityFrameworkCore;
using System;
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
                response.ErrorType = ErrorType.NotFound;
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
            response.ErrorType = ErrorType.ServerError;
            response.Success = false;
            _logger.LogError(ex.Message);
        }


        return response;
    }

    public async Task<ServiceResponse<IEnumerable<CommentDto>>> GetCommentsAsync(long accountTlgId, int offset = 0, int count = 20)
    {
        var response = new ServiceResponse<IEnumerable<CommentDto>>();

        if (_context.Accounts == null || _context.Comments == null)
        {
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
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
                response.ErrorType = ErrorType.NotFound;
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
            response.ErrorType = ErrorType.ServerError;
            response.Success = false;
            _logger.LogError(ex.Message);
        }
        return response;
    }

    public async Task<ServiceResponse<int>> GetCommentsCountAsync(long accountTlgId)
    {
        var response = new ServiceResponse<int>();

        if (_context.Accounts == null || _context.Comments == null)
        {
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
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
            response.ErrorType = ErrorType.ServerError;
            response.Success = false;
            _logger.LogError(ex.Message);
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
            response.ErrorType = ErrorType.ServerError;
            response.Data = null;
            return response;
        }

        try
        {
            var commentFromDb = await _context.Comments.Where(c => c.From.TlgId == accountTlgId).FirstAsync();
            long commentId = commentFromDb.TlgId;
            var peerId = commentFromDb.PeerId;
            var postId = commentFromDb.PostId;

            var allChats = await _client.Messages_GetAllChats();
            var chatNeeded = allChats.chats.Where(c => c.Value.ID == peerId).FirstOrDefault().Value;

            if (chatNeeded == null)
            {
                _logger.LogError("Chat of comment not found");
                response.Success = false;
                response.ErrorType = ErrorType.NotFound;
                response.Message = "Chat of comment not found";
                return response;
            }

            var inputMessage = new InputMessageID();
            inputMessage.id = (int)postId;

            var posts = await _client.GetMessages(chatNeeded, new InputMessage[] { inputMessage });
            var postNeeded = posts.Messages.FirstOrDefault();

            if (postNeeded == null)
            {
                _logger.LogError("Chat of comment not found");
                response.Success = false;
                response.ErrorType = ErrorType.NotFound;
                response.Message = "Chat of comment not found";
                return response;
            }

            var comments = await _client.Messages_GetReplies(chatNeeded, postNeeded.ID);
            var commentNeeded = comments.Messages.Where(c => c.ID == commentId).FirstOrDefault();

            if (commentNeeded == null)
            {
                _logger.LogError("User's comment not found");
                response.Success = false;
                response.ErrorType = ErrorType.NotFound;
                response.Message = "User's comment not found";
                return response;
            }

            //InputPeer: TL.InputPeerSelf,            TL.InputPeerChat, TL.InputPeerUser, TL.InputPeerChannel,
            //           TL.InputPeerUserFromMessage, TL.InputPeerChannelFromMessage

            //InputUserBase: InputUserSelf,InputUser,InputUserFromMessage

            //Peer PeerUser, PeerChat, PeerChannel

            //var inputUser = new InputUser(commentNeeded.From, ((PeerUser)commentNeeded.From));

            InputUserFromMessage inputUserFromMessage = new InputUserFromMessage();
            inputUserFromMessage.peer = chatNeeded;
            inputUserFromMessage.user_id = commentNeeded.From.ID;
            //inputUserFromMessage.msg_id = commentNeeded.ID;
            inputUserFromMessage.msg_id = postNeeded.ID;

            int delay = 300;
            while (true)
            {
                if (delay > 8000)
                {
                    break;
                }

                try
                {
                    //InputUser userBase = new(commentNeeded.From.ID, user.access_hash);
                    var userInfo = await _client.Users_GetFullUser(inputUserFromMessage);
                    var acc = _mapper.Map<AccountDto>(userInfo);
                    response.Data = acc;

                    //InputPeer inputPeer = new InputPeerChat(peerId);
                    //var inputUserFromMessage = new InputUserFromMessage()
                    //{
                    //    peer = inputPeer,
                    //    msg_id = (int)comment.TlgId,
                    //    user_id = accountTlgId
                    //};

                    //var fullUser = await _client.Users_GetFullUser(inputUserFromMessage);
                    //var acc = _mapper.Map<AccountDto>(fullUser.users.First().Value);
                    //response.Data = acc;
                    return response;
                }
                catch (Exception)
                {
                    delay = delay * 3;
                }
                Thread.Sleep(delay);
            }

            response.Success = false;
            response.Message = "Сouldn't get user information";
            response.ErrorType = ErrorType.ServerError;
            return response;
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            _logger.LogError(ex.Message);
            return response;
        }
        finally
        {
            //_client.Dispose(); // Dispose the client when done
        }
    }
}
