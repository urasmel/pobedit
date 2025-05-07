namespace Gather.Utils.ConfigService
{

    public interface IConfigUtils
    {
        Func<string, string> Config();
    }
}
