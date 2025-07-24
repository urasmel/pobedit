using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Gather.Utils.Gather.Notification;
using Microsoft.EntityFrameworkCore;
using TL;

namespace Gather.Utils.Gather;

public static class Gatherer
{
    private static Messages_Chats? message_chats;

    public static async Task UpdateChannelPosts(
        long chatId,
        IGatherNotifier loadingHelper,
        GatherClient _client,
        DataContext _context,
        IMapper mapper,
        PobeditSettings pobeditSettings,
        ILogger logger)
    {
        try
        {
            await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            var errorMessage = "The error while logging telegram user.";
            logger.LogError(exception, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        try
        {
            if (message_chats == null)
            {
                message_chats = await _client.Messages_GetAllChats();
            }
            var peersWithKey = message_chats.chats.Where(chat => chat.Key == chatId);

            if (!peersWithKey.Any())
            {
                var errorMessage = "Channel not found in subscriptions. You may have unsubscribed from the channel.";
                await loadingHelper.NotifyFailureEndingAsync(errorMessage);
                return;
            }

            // Получаем из БД последнее сообщение, канала.
            var postFromDb = _context.Posts
                .Where(post => post.PeerId == chatId)
                .OrderBy(post => post.TlgId)
                .LastOrDefault();
            int startOffsetId = 0;

            InputPeer peer = peersWithKey.First().Value;
            if (postFromDb == null)
            {
                // Если пусто, запрашиваем у телеграмма последний пост и
                // используем его как начала для скачивания постов в прошлом.
                var lastMessagesBase = await _client.Messages_GetHistory(peer, offset_date: pobeditSettings.StartGatherDate, limit: 1);

                if (lastMessagesBase is not Messages_ChannelMessages channelMessages)
                {
                    await loadingHelper.NotifySuccessEndingAsync("Channel peer is not ChannelMessages");
                    logger.LogInformation("Channel peer is not ChannelMessages");
                    return;
                }

                if (channelMessages.count == 0)
                {
                    await loadingHelper.NotifySuccessEndingAsync($"No data in the channel {peer.ID}.");
                    logger.LogInformation($"No data in the channel {peer.ID}.");
                    return;
                }

                var msgBase = channelMessages.messages[0];
                startOffsetId = msgBase.ID;
            }
            else
            {
                // Если не пусто, то его id используем для запроса новых постов канала как смещение.
                startOffsetId = (int)postFromDb.TlgId;
            }

            // Возможно потом пригодится.
            bool needBreak = false;

            while (true)
            {
                var messagesBase = await _client.Messages_GetHistory(
                    peer,
                    min_id: startOffsetId);

                if (messagesBase is not Messages_ChannelMessages channelMessages) break;

                if (channelMessages.messages.Count() == 0)
                {
                    break;
                }

                for (int index = channelMessages.messages.Length - 1; index >= 0; index--)
                {

                    // TODO Тестируем этот код.
                    // TODO Если текста нет, то отбрасываем. Исправить потом, чтобы все ел.
                    if (channelMessages.messages[index] is TL.Message msg && !string.IsNullOrEmpty(msg.message))
                    {
                        var postToDb = mapper.Map<Post>(msg);
                        var postDto = mapper.Map<PostDto>(postToDb);

                        try
                        {
                            // Получаем комментарии.
                            postToDb.CommentsCount = 0;
                            postDto.CommentsCount = 0;

                            await _context.Posts.AddAsync(postToDb);
                            await _context.SaveChangesAsync();
                        }
                        catch (Exception exception)
                        {
                            var errorMessage = "UpdateChannelPosts";
                            logger.LogError(exception, errorMessage);
                        }

                        if (index % 20 == 0 || index == channelMessages.messages.Length - 1)
                        {
                            await loadingHelper.NotifyProgressAsync(postDto.Date.ToString("yyyy:MM:dd HH:mm:ss"));
                            bool isNeedStop = await loadingHelper.CheckIsNeedStopAsync();
                            if (isNeedStop)
                            {
                                await loadingHelper.NotifySuccessEndingAsync("Closed by client");
                                return;
                            }
                        }
                    }

                    startOffsetId = channelMessages.messages.Select(m => m.ID).Max();
                    Thread.Sleep(100);
                }

                if (needBreak)
                {
                    break;
                }
            }
            await loadingHelper.NotifySuccessEndingAsync("Updating post for one channel was completed successfully");
        }
        catch (InvalidOperationException ex)
        {
            var errorMessage = "An error ocurred while updating channel's posts." +
                " You may no longer subscribe to this channel.";
            logger.LogError(ex.Message, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
        }
        catch (Exception ex)
        {
            var errorMessage = "An error ocurred while updating channel's posts.";
            logger.LogError(ex.Message, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
        }
    }

    public static async Task UpdatePostComments(
        long chatId,
        long postId,
        IGatherNotifier loadingHelper,
        GatherClient _client,
        DataContext _context,
        IMapper mapper,
        PobeditSettings pobeditSettings,
        ILogger logger)
    {
        try
        {
            await _client.LoginUserIfNeeded();
        }
        catch (Exception exception)
        {
            var errorMessage = "The error while logging telegram user.";
            logger.LogError(exception, errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (_context.Channels == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        var chan = await _context.Channels.Where(c => c.TlgId == chatId).FirstOrDefaultAsync();
        if (chan == null)
        {
            var errorMessage = "The channel is not found.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (!chan.HasCommnets)
        {
            var errorMessage = "The channel has no comments.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (_context.Comments == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        if (_context.Posts == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. DB error.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        var post = await _context.Posts.FirstAsync(p => p.TlgId == postId && p.PeerId == chatId);
        if (post == null)
        {
            var errorMessage = "An error ocurred while updating post's comments. Post not found in DB.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }


        if (message_chats == null)
        {
            message_chats = await _client.Messages_GetAllChats();
        }

        if (!message_chats.chats.ContainsKey(chatId))
        {
            var errorMessage = "An error ocurred while updating post's comments." +
                "Cannot find channel in telegram. You may have unsubscribed from the channel.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }

        try
        {
            var channel = message_chats.chats[chatId];

            //(channel as TL.Channel).access_hash
            //(channel as TL.Channel).flags
            //(channel as TL.Channel).ToInputPeer
            //if(channel is TL.Channel)
            //{
            //    if(!(channel as TL.Channel).flags.HasFlag(TL.Channel.Flags.has_link))
            //    {
            //        var errorMessage = "The channel does not have a subgroup of comments.";
            //        logger.LogError(errorMessage);
            //        await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            //        return;
            //    }
            //}


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
                logger.LogError(errorMessage);
                await loadingHelper.NotifyFailureEndingAsync(errorMessage);
                return;
            }

            var msg = messages.Messages[0] as TL.Message;
            if (msg == null)
            {
                var errorMessage = "An error ocurred while updating post's comments. Post is not a message.";
                logger.LogError(errorMessage);
                await loadingHelper.NotifyFailureEndingAsync(errorMessage);
                return;
            }

            // Для того, чтобы не добавлять комментарии, которые уже есть в базе.
            var lastCommentId = 0;

            var pId = await _context.Posts.Where(p => p.TlgId == postId && p.PeerId == chatId).FirstOrDefaultAsync();
            bool commentsExist = _context.Comments
                .Any(c => c.PostId == pId.PostId);

            var dbCommentsIds = _context.Comments
                    //.Where(c => c.PostId == post.TlgId && c.PeerId == channel.ID)
                    .Where(c => c.PostId == pId.PostId)
                    .Select(c => c.TlgId).ToHashSet();

            if (commentsExist)
            {
                lastCommentId = (int)_context.Comments
                    .Where(c => c.PostId == pId.PostId)
                    .Select(c => c.TlgId).Max();
            }

            Messages_MessagesBase replies;

            do
            {
                if (lastCommentId != 0)
                {
                    replies = await _client.Messages_GetReplies(channel, msg.ID, min_id: lastCommentId);
                }
                else
                {
                    replies = await _client.Messages_GetReplies(channel, msg.ID, offset_id: lastCommentId);
                }

                if (replies.Messages.Length == 0)
                {
                    break;
                }
                var client_comments = replies.Messages;

                //foreach (var comment in client_comments)
                for (int i = client_comments.Length - 1; i >= 0; i--)
                {
                    // Пропускаем комментарии, которые уже есть в базе.
                    //if (dbCommentsIds.Contains(comment.ID))
                    if (dbCommentsIds.Contains(client_comments[i].ID))
                    {
                        continue;
                    }

                    //var newComment = mapper.Map<Comment>(comment);
                    var newComment = mapper.Map<Comment>(client_comments[i]);
                    try
                    {
                        if (newComment == null)
                        {
                            continue;
                        }

                        newComment.PeerId = channel.ID;
                        newComment.From = new Account();
                        //newComment.From.TlgId = comment.From.ID;
                        newComment.From.TlgId = client_comments[i].From.ID;

                        newComment.PostId = msg.ID;

                        var user = await _context.Accounts
                            .Where(acc => acc.TlgId == newComment.From.TlgId)
                            .FirstOrDefaultAsync();

                        if (user == null)
                        {
                            var channel_messages = replies as Messages_ChannelMessages;
                            if (channel_messages == null)
                            {
                                continue;
                            }

                            var chats = channel_messages.chats;
                            if (chats.Count == 0)
                            {
                                continue;
                            }

                            var inputPeer = chats.First().Value;
                            var inputUserFromMessage = new InputUserFromMessage()
                            {
                                peer = inputPeer,
                                //msg_id = comment.ID,
                                msg_id = client_comments[i].ID,
                                user_id = (long)newComment.From.TlgId
                            };

                            var fullUser = await _client.Users_GetFullUser(inputUserFromMessage);
                            var acc = mapper.Map<Account>(fullUser.users.First().Value);
                            await _context.Accounts.AddAsync(acc);
                            newComment.From = acc;
                        }
                        else
                        {
                            newComment.From = user;
                        }
                    }
                    catch (RpcException ex)
                    {
                        Console.WriteLine($"Flood wait: {ex.X} minutes");
                    }
                    catch (Exception exception)
                    {
                        logger.LogError(exception.Message);
                        continue;
                    }

                    try
                    {
                        post.Comments.Add(newComment);
                        post.AreCommentsLoaded = true;
                        await _context.SaveChangesAsync();
                        dbCommentsIds.Add(client_comments[i].ID);

                        Thread.Sleep(Random.Shared.Next(50, 150));
                        await loadingHelper.NotifyProgressAsync(newComment.Date.ToString("yyyy:MM:dd HH:mm:ss"));
                        bool isNeedStop = await loadingHelper.CheckIsNeedStopAsync();

                        if (isNeedStop)
                        {
                            await loadingHelper.NotifySuccessEndingAsync("Closed by client");
                            post.CommentsCount = replies.Count;
                            await _context.SaveChangesAsync();
                            return;
                        }
                    }
                    catch (Exception exception)
                    {
                        logger.LogError("Ошибка добавления комментария: {1}", exception.Message);
                    }
                }

                lastCommentId = client_comments.Select(c => c.ID).Max();
            }
            while (true);

            post.CommentsCount = replies.Count;
            await _context.SaveChangesAsync();
        }
        catch (Exception)
        {
            var errorMessage = "An error ocurred while updating post's comments.";
            logger.LogError(errorMessage);
            await loadingHelper.NotifyFailureEndingAsync(errorMessage);
            return;
        }
        finally
        {
            await loadingHelper.NotifySuccessEndingAsync("Closing");
        }
    }
}
