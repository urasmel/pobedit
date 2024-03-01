using AutoMapper;
using SharedCore.Dtos.User;
using SharedCore.Models;

namespace ControlService
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, GetUserDto>();
            CreateMap<AddUserDto, User>();
        }
    }
}
