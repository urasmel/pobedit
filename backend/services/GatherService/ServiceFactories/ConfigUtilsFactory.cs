using Gather.Utils.ConfigService;

namespace Gather.ServiceFactories;

internal sealed class ConfigUtilsFactory
{
    public static ConfigUtils Create(
    string apiId,
    string apiHash,
    string phoneNumber)
    {
        return new ConfigUtils(apiId, apiHash, phoneNumber);
    }
}
