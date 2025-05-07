using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Microsoft.EntityFrameworkCore;
using TL;

namespace Gather.Services.Accounts;

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

        if (_context.Comments == null)
        {
            _logger.LogError("Comments in db context is null");
            response.Success = false;
            response.ErrorType = ErrorType.ServerError;
            response.Message = "Server error";
            return response;
        }

        try
        {
            var commentFromDb = await _context
                .Comments
                .Where(c => c.From != null && c.From.TlgId == accountTlgId)
                .FirstAsync();

            if (commentFromDb == null)
            {
                _logger.LogError("User's comments not found");
                response.Success = false;
                response.ErrorType = ErrorType.NotFound;
                response.Message = "Data for retrieving user info not found";
                return response;
            }

            // Получаем нужный канал.
            var allChannels = await _client.Messages_GetAllChats();
            var channelNeeded = allChannels
                .chats
                .Where(c => c.Value.ID == commentFromDb.PeerId)
                .FirstOrDefault().Value;

            if (channelNeeded == null)
            {
                _logger.LogError("Channel of comment not found");
                response.Success = false;
                response.ErrorType = ErrorType.NotFound;
                response.Message = "Channel of comment not found";
                return response;
            }

            // Получаем нужный пост в канале.
            var inputMessage = new InputMessageID();
            inputMessage.id = (int)commentFromDb.PostId;
            var posts = await _client.GetMessages(channelNeeded, new InputMessage[] { inputMessage });
            var postNeeded = posts.Messages.FirstOrDefault();

            if (postNeeded == null)
            {
                _logger.LogError("Chat of comment not found");
                response.Success = false;
                response.ErrorType = ErrorType.NotFound;
                response.Message = "Chat of comment not found";
                return response;
            }

            // Получаем нужный комментарий к посту.
            int offset = 0;
            MessageBase? commentNeeded;
            Messages_MessagesBase? comments;
            while (true)
            {
                comments = await _client.Messages_GetReplies(channelNeeded, postNeeded.ID, offset);
                var replies = comments.Messages;
                if (replies.Count() == 0)
                {
                    _logger.LogError("User's comment not found");
                    response.Success = false;
                    response.ErrorType = ErrorType.NotFound;
                    response.Message = "User's comment not found";
                    return response;
                }
                commentNeeded = replies.Where(c => c.ID == commentFromDb.TlgId).FirstOrDefault();
                if (commentNeeded != null)
                {
                    break;
                }
                offset = replies.Last().ID;
            }

            // Получаем чат, привязанный к каналу.
            var messages = comments as Messages_ChannelMessages;
            var chats = messages.chats;
            var inputPeer = chats.First().Value;

            // Получаем информацию о пользователе.
            var inputUserFromMessage = new InputUserFromMessage()
            {
                peer = inputPeer,
                msg_id = commentNeeded.ID,
                user_id = commentNeeded.From.ID
            };

            var userInfo = await _client.Users_GetFullUser(inputUserFromMessage);
            var acc = _mapper.Map<AccountDto>(userInfo);

            // Получаем одно фото пользователя.
            MemoryStream ms = new(1000000);
            Storage_FileType storage = await _client.DownloadProfilePhotoAsync(userInfo.users.First().Value, ms);
            acc.Photo = Convert.ToBase64String(ms.ToArray());

            // Сохраняем обновленную информацию о пользователе в базу.
            var account = await _context.Accounts.Where(a => a.TlgId == accountTlgId).FirstAsync();
            //account = _mapper.Map<Account>(acc);
            account.FirstName = acc.FirstName;
            account.LastName = acc.LastName;
            account.Username = acc.Username;
            account.Bio = acc.Bio;
            account.Phone = acc.Phone;
            account.Photo = acc.Photo;
            account.MainUsername = acc.MainUsername;
            await _context.SaveChangesAsync();

            // Возвращаем назад.
            response.Data = acc;
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
