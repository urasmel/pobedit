using AutoMapper;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Dtos.User;
using SharedCore.Models;
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
            CreateMap<SharedCore.Models.Channel, ChannelInfoDto>();
            CreateMap<SharedCore.Models.Channel, ChannelDto>();
            CreateMap<Message, Post>();
            CreateMap<Post, PostDto>(); 
            CreateMap<SharedCore.Models.Channel, InputPeer>();
        }
    }
}
