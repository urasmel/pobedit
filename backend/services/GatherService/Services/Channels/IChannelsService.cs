using Gather.Dtos;
using Gather.Models;
using System.Net.WebSockets;

namespace Gather.Services.Channels;

public interface IChannelsService
{
    Task<ServiceResponse<IEnumerable<ChannelDto>>> GetAllChannels();

    Task<ServiceResponse<IEnumerable<long>>> UpdateChannels();

    Task<ServiceResponse<ChannelDto>> UpdateChannelInfo(long chatId);

    Task<ServiceResponse<ChannelDto>> GetChannelInfo(long chatId);

}
