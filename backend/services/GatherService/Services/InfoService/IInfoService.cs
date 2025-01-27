﻿using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Models;
using System.Net.WebSockets;

namespace Gather.Services
{
    public interface IInfoService
    {
        Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels();

        Task<ServiceResponse<IEnumerable<long>>> UpdateChannels();


        Task<ServiceResponse<ChannelDto>> UpdateChannelInfo(long chatId);

        Task<ServiceResponse<ChannelDto>> GetChannelInfo(long chatId);

        Task<ServiceResponse<IEnumerable<PostDto>>> GetChannelPosts(long chatId, int offset, int count);

        ServiceResponse<IEnumerable<PostDto>> GetChannelPosts(long chatId, DateTime startTime);

        Task UpdateChannelPosts(long chatId, WebSocket webSocket);

        Task UpdatePostComments(long chatId, long postId, WebSocket webSocket);

        Task<ServiceResponse<int>> GetCommentsCount(long chatId, long postId);

        Task<ServiceResponse<IEnumerable<CommentDto>>> GetComments(long chatId, long postId, int offset = 0, int limit = 0);

        Task UpdatePostComments(long chatId, long postId);

        Task<ServiceResponse<Account>> GetAccaunt(long accountTlgId);
    }
}
