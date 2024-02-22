using AutoMapper;
using ControlService.Dtos.Account;
using SharedCore.Models;

namespace ControlService
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Account, GetUserDto>();
            CreateMap<AddUserDto, Account>();
        }
    }
}
