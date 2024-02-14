namespace GatherMicroservice.Utils
{

    public interface IConfigUtils
    {
        Func<string, string> Config();
    }
}
