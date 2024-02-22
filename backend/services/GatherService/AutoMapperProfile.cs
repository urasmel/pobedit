using AutoMapper;
using SharedCore.Dtos;
using TL;

namespace GatherMicroservice
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Message, PostDto>();
        }
    }
}
