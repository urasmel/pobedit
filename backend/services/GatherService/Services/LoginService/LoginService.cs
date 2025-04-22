using Gather.Dtos;
using Gather.Models;

namespace Gather.Services;

public class LoginService : ILoginService
{
    ILogger _logger;
    WTelegram.Client? _client;
    TL.User? user;

    public LoginService(ILogger<LoginService> logger)
    {
        _logger = logger;
    }

    public async Task<ServiceResponse<long>> Login(LoginDto loginDto)
    {
        var response = new ServiceResponse<long>();

        try
        {
            Func<string, string> Config = what =>
            {
                if (what == "api_id") return "15877832";
                if (what == "api_hash") return "5286817305a3075d7157aa4cab822335";
                if (what == "phone_number") return loginDto.PhoneNumber;
                if (what == "verification_code") return null; // let WTelegramClient ask the user with a console prompt 
                                                              //if (what == "first_name") return loginDto.FirstName;      // if sign-up is required
                                                              //if (what == "last_name") return loginDto.LastName;        // if sign-up is required
                if (what == "password") return loginDto.Password;     // if user has enabled 2FA
                return string.Empty;
            };

            _client = new WTelegram.Client(Config);
            user = await _client.LoginUserIfNeeded();

            if (user == null)
            {
                response.Success = false;
                response.Message = "Access denied";
            }
            else
            {
                response.Success = true;
                response.Message = "Login successfully";
                response.Data = user.ID;
            }

            return response;
        }
        catch (Exception)
        {
            response.Success = false;
            response.Message = "Login error";
            return response;
        }


        #region 
        //_logger.LogDebug($"We are logged-in as {user.username ?? user.first_name + " " + user.last_name} (id {user.id})");

        //var chats = await _client.Messages_GetAllChats(); // chats = groups/channels (does not include users dialogs)
        //_logger.LogDebug("This user has joined the following:");
        //foreach (var (id, chat) in chats.chats)
        //    switch (chat)
        //    {
        //        case Chat smallgroup when smallgroup.IsActive:
        //            _logger.LogDebug($"{id}:  Small group: {smallgroup.title} with {smallgroup.participants_count} members");
        //            break;
        //        case Channel channel when channel.IsChannel:
        //            _logger.LogDebug($"{id}: Channel {channel.username}: {channel.title}");
        //            break;
        //        case Channel group: // no broadcast flag => it's a big group, also called supergroup or megagroup
        //            _logger.LogDebug($"{id}: Group {group.username}: {group.title}");
        //            break;
        //    }

        //_logger.LogDebug("Type a chat ID to send a message: ");
        #endregion
    }
}
