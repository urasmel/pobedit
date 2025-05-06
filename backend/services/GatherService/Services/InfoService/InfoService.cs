using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Gather.Utils;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;
using TL;

namespace Gather.Services.InfoService;

public class InfoService(GatherClient client, DataContext context, IMapper mapper, ILogger<InfoService> logger) : IInfoService
{
    // Дата, с которой начинаем загружать данные.
    private readonly DateTime startLoadingDate = DateTime.Parse("Apr 25, 2025");
    readonly ILogger _logger = logger;
    readonly GatherClient _client = client;
    TL.User? user;
    private readonly IMapper _mapper = mapper;
    private readonly DataContext _context = context;
    readonly Object lockObject = new();
    static bool updateChannelsEnable = true;


    public async Task<ServiceResponse<long>> GetCommentsCount(long chatId, long postId)
    {
        var response = new ServiceResponse<long>();

        if (_context.Comments == null)
        {
            _logger.LogError("DB context with comments is null.");
            response.Success = false;
            response.Message = "Error fetching data from DB.";
            response.ErrorType = ErrorType.ServerError;
            response.Data = 0;
            return response;
        }

        if (chatId <= 0)
        {
            response.Success = false;
            response.Message = "Malformed parameter: chat identifier";
            response.ErrorType = ErrorType.MalFormedData;
            response.Data = 0;
            return response;
        }

        try
        {
            var count = await _context
                .Comments
                .Where(comment => comment.PeerId == chatId && comment.PostId == postId)
                .CountAsync();
            response.Data = count;
            response.Success = true;
            return response;
        }
        catch (Exception exception)
        {
            response.Success = false;
            response.Message = exception.Message;
            response.ErrorType = ErrorType.ServerError;
            response.Data = 0;
            return response;
        }
    }

    public async Task<ServiceResponse<IEnumerable<CommentDto>>> GetComments(long chatId, long postId, int offset = 0, int limit = 10)
    {
        var response = new ServiceResponse<IEnumerable<CommentDto>>();

        if (_context.Comments == null)
        {
            _logger.LogError("GetComments, _context.Comments is null");
            response.Success = false;
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
            return response;
        }

        try
        {
            var comments = await _context.Comments
                .Include(comment => comment.From)
                .Where(c => c.PostId == postId && c.PeerId == chatId)
                .OrderBy(c => c.TlgId)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();

            var results = _mapper.Map<List<CommentDto>>(comments);
            response.Data = results;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "GetComments");
            response.Success = false;
            response.Message = "An error has occurred while getting comments." +
                Environment.NewLine +
                exception.Message;
            response.ErrorType = ErrorType.ServerError;
            response.Data = [];
        }

        return response;
    }

    public async Task UpdatePostComments(long chatId, long postId, WebSocket webSocket)
    {
        try
        {
            user ??= await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            var errorMessage = "The error while logging telegram user.";
            _logger.LogError(exception, errorMessage);

            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        if (_context.Comments == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        if (_context.Posts == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        var buffer = new byte[1024 * 4];
        var receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);

        var _cts = new CancellationTokenSource();

        #region Test

        //int i = 0;
        //while (!receiveResult.CloseStatus.HasValue)
        //{
        //    SendAsyncMessage(
        //        webSocket,
        //        DateTime.Now.ToString(new CultureInfo("ru-RU"))
        //        );
        //    i++;
        //    Thread.Sleep(1000);

        //    if (i == 5)
        //    {

        //        await webSocket.CloseAsync(
        //        WebSocketCloseStatus.InternalServerError,
        //            receiveResult.CloseStatusDescription,
        //            CancellationToken.None);
        //        return;
        //    }

        //    receiveResult = await webSocket.ReceiveAsync(
        //        new ArraySegment<byte>(buffer), CancellationToken.None);
        //    Console.Write(receiveResult.ToString());
        //}

        //await webSocket.CloseAsync(
        //    receiveResult.CloseStatus.Value,
        //    receiveResult.CloseStatusDescription,
        //    CancellationToken.None);
        //return;

        #endregion Endtest

        var post = await _context.Posts.FirstAsync(p => p.TlgId == postId && p.PeerId == chatId);
        if (post == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. Post not found in DB.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                errorMessage,
                CancellationToken.None);
            return;
        }

        var message_chats = await _client.Messages_GetAllChats();

        if (!message_chats.chats.ContainsKey(chatId))
        {
            var errorMessage = "An error ocurred while updating post's comments." +
                "Cannot find channel in telegram. You may have unsubscribed from the channel.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }

        try
        {
            var channel = message_chats.chats[chatId];
            InputMessageID[] meessages_ids = new InputMessageID[1];
            var messageID = new InputMessageID();
            messageID.id = (int)postId;
            var messages = await _client.GetMessages(channel.ToInputPeer(), [messageID]);

            if (messages == null
                || messages.Count == 0
                || messages.Messages == null
                || messages.Messages.Length == 0)
            {
                var errorMessage = "Post not found.";
                _logger.LogError(errorMessage);
                await webSocket.CloseAsync(
                    WebSocketCloseStatus.NormalClosure,
                    errorMessage,
                    CancellationToken.None);
                return;
            }


            var msg = messages.Messages[0] as TL.Message;
            if (msg == null)
            {
                var errorMessage = "An error ocurred while updating post's comments. Post is not a message.";
                _logger.LogError(errorMessage);
                await webSocket.CloseAsync(
                    WebSocketCloseStatus.NormalClosure,
                    errorMessage,
                    CancellationToken.None);
                return;
            }

            await LoadPostComments(channel, msg, post, webSocket);
        }
        catch (Exception)
        {
            var errorMessage = "An error ocurred while updating post's comments.";
            _logger.LogError(errorMessage);
            await webSocket.CloseAsync(
                WebSocketCloseStatus.InternalServerError,
                errorMessage,
                CancellationToken.None);
            return;
        }
    }

    private async Task LoadPostComments(InputPeer peer, Message msg, Post postToDb, WebSocket webSocket)
    {
        // Для того, чтобы не добавлять комментарии, которые уже есть в базе.
        var lastCommentId = 0;
        bool commentsExist = _context.Comments
            .Any(c => c.PostId == postToDb.TlgId && c.PeerId == peer.ID);

        var dbCommentsIds = _context.Comments
                .Where(c => c.PostId == postToDb.TlgId && c.PeerId == peer.ID)
                .Select(c => c.TlgId).ToHashSet();

        if (commentsExist)
        {
            lastCommentId = (int)_context.Comments
                .Where(c => c.PostId == postToDb.TlgId && c.PeerId == peer.ID)
                .Select(c => c.TlgId).Max();
        }

        Messages_MessagesBase replies;

        do
        {
            replies = await _client.Messages_GetReplies(peer, msg.ID, lastCommentId);

            if (replies.Messages.Length == 0)
            {
                break;
            }
            var client_comments = replies.Messages;

            foreach (var comment in client_comments)
            {
                // Пропускаем комментарии, которые уже есть в базе.
                if (dbCommentsIds.Contains(comment.From.ID))
                {
                    continue;
                }

                var newComment = _mapper.Map<Comment>(comment);
                if (newComment == null)
                {
                    continue;
                }

                newComment.PeerId = peer.ID;
                newComment.From = new Account();
                newComment.From.TlgId = comment.From.ID;

                try
                {
                    newComment.PostId = msg.ID;

                    var user = await _context.Accounts
                        .Where(acc => acc.TlgId == newComment.From.TlgId)
                        .FirstOrDefaultAsync();

                    if (user == null)
                    {
                        var messages = replies as Messages_ChannelMessages;
                        if (messages == null)
                        {
                            continue;
                        }

                        var chats = messages.chats;
                        if (chats.Count == 0)
                        {
                            continue;
                        }

                        var inputPeer = chats.First().Value;
                        var inputUserFromMessage = new InputUserFromMessage()
                        {
                            peer = inputPeer,
                            msg_id = comment.ID,
                            user_id = newComment.From.TlgId
                        };

                        var fullUser = await _client.Users_GetFullUser(inputUserFromMessage);
                        var acc = _mapper.Map<Account>(fullUser.users.First().Value);
                        await _context.Accounts.AddAsync(acc);
                        newComment.From = acc;
                    }
                    else
                    {
                        newComment.From = user;
                    }

                }
                catch (Exception exception)
                {
                    _logger.LogError(exception.Message);
                    continue;
                }
                postToDb.Comments.Add(newComment);
                SocketHelper.SendAsyncMessage(
                    webSocket,
                    newComment.Date.ToString("yyyy:MM:dd HH:mm:ss")
                    );

                await _context.SaveChangesAsync();
                Thread.Sleep(Random.Shared.Next(500, 1500));
            }

            lastCommentId = client_comments.Last().ID;
        }
        while (true);
        postToDb.CommentsCount = replies.Count;
        await _context.SaveChangesAsync();
    }

}

