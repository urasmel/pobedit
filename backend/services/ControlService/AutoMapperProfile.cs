using AutoMapper;
using ControlService.Dtos.Account;
using ControlService.Models;

namespace ControlService
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Account, GetAccountDto>();
            CreateMap<AddAccountDto, Account>();
        }
    }
}
