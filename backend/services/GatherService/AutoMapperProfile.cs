using AutoMapper;
using SharedCore.Dtos;
using SharedCore.Dtos.User;
using SharedCore.Dtos.Channel;
using TL;

namespace GatherMicroservice
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Message, PostDto>();
            CreateMap<TL.User, GetUserDto>();
            CreateMap<SharedCore.Models.Channel, ChatBase>();
            CreateMap<ChatBase, SharedCore.Models.Channel>();
            CreateMap<SharedCore.Models.Channel, ChannelDto>();
        }
    }
}
