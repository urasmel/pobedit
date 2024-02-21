using AutoMapper;
using GatherMicroservice.Dtos;
using TL;

namespace GatherMicroservice
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Message, MessageDto>();
        }
    }
}
