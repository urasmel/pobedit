using ControlService.Data;
using ControlService.Dtos.Account;
using ControlService.Models;
using AutoMapper;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Principal;

namespace ControlService.Services.AccountService
{
    public class AccountService : IAccountService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public AccountService(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<ServiceResponse<GetAccountDto>> GetAccountById(int id)
        {
            var serviceResponse = new ServiceResponse<GetAccountDto>();
            var dbAccount = await _context.Accounts
                .FirstOrDefaultAsync(c => c.Id == id);
            serviceResponse.Data = _mapper.Map<GetAccountDto>(dbAccount);
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetAccountDto>>> GetAllAccounts()
        {
            var response = new ServiceResponse<List<GetAccountDto>>();
            var dbAccounts = await _context.Accounts.ToListAsync();
            response.Data = dbAccounts.Select(a => _mapper.Map<GetAccountDto>(a)).ToList();
            return response;
        }

        public async Task<ServiceResponse<int>> AddAccount(AddAccountDto newAccount)
        {
            var response = new ServiceResponse<int>();
            Account? account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Password == newAccount.Password && a.Username == newAccount.Username);
            if (account != null)
            {
                response.Success = false;
                response.Message = "Account already exists";
            }
            else
            {
                Account acc = _mapper.Map<Account>(newAccount);

                _context.Accounts.Add(acc);
                await _context.SaveChangesAsync();
                response.Data = _context.Accounts
                    .Where(a => a.Password == acc.Password && a.Username == acc.Username)
                    .Select(a => _mapper.Map<GetAccountDto>(a).Id).First();
                response.Success = true;
            }

            return response;
        }

        public async Task<ServiceResponse<GetAccountDto>> DeleteAccount(int id)
        {
            ServiceResponse<GetAccountDto> response = new ServiceResponse<GetAccountDto>();

            try
            {
                Account? account = await _context.Accounts
                    .FirstOrDefaultAsync(c => c.Id == id);
                if (account != null)
                {
                    _context.Accounts.Remove(account);
                    await _context.SaveChangesAsync();
                    response.Data = _mapper.Map<GetAccountDto>(account);
                }
                else
                {
                    response.Success = false;
                    response.Message = "Account not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<GetAccountDto>> EditAccount(Account acc)
        {
            var response = new ServiceResponse<GetAccountDto>();

            try
            {
                Account? account = await _context.Accounts
                    .FirstOrDefaultAsync(a => a.Id == acc.Id);

                if (_context.Accounts.Count(a => a.Username == acc.Username && account.Id!=acc.Id) > 0)
                {
                    response.Success = false;
                    response.Message = "Account with this username already exists";
                }
                else if (_context.Accounts.Count(a => a.PhoneNumber == acc.PhoneNumber && account.Id != acc.Id) > 0)
                {
                    response.Success = false;
                    response.Message = "Account with this phone number already exists";
                }
                else if (account == null)
                {
                    response.Success = false;
                    response.Message = "Account not found";
                }
                else
                {
                    account.Password = acc.Password;
                    account.Username = acc.Username;
                    account.PhoneNumber = acc.PhoneNumber;

                    await _context.SaveChangesAsync();
                    response.Data = _mapper.Map<GetAccountDto>(account);
                    response.Success = true;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }
    }
}
