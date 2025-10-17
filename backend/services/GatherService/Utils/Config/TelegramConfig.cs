namespace Gather.Utils.ConfigService;

public class TelegramConfig(string apiId, string apiHash, string phoneNumber) : IConfigUtils
{
    public Func<string, string?> ConfigMethod = what =>
    {
        if (what == "api_id") return apiId;
        if (what == "api_hash") return apiHash;
        if (what == "phone_number") return phoneNumber;
        //if (what == "phone_number") return "9996623333";
        if (what == "verification_code") return null; // let WTelegramClient ask the user with a console prompt
        //if (what == "verification_code") return "22222";
        if (what == "server_address") return "2>149.154.167.40:443";
        //if (what == "password") return "password";     // if user has enabled 2FA
        return null;
    };

    public Func<string, string?> Config()
    {
        return ConfigMethod;
    }
}
