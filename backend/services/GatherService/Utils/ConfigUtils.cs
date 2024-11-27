namespace GatherMicroservice.Utils
{

    public class ConfigUtils : IConfigUtils
    {
        public Func<string, string> ConfigMethod = what =>
        {
            if (what == "api_id") return "15877832";
            if (what == "api_hash") return "5286817305a3075d7157aa4cab822335";
            if (what == "phone_number") return "+79624528201";
            if (what == "verification_code") return null; // let WTelegramClient ask the user with a console prompt
            //if (what == "password") return "password";     // if user has enabled 2FA
            return null;
        };

        public Func<string, string> Config()
        {
            return ConfigMethod;
        }
    }
}
