using Gather.Utils.ConfigService;

namespace Gather.ServiceFactories;

internal sealed class ConfigUtilsFactory
{
    public static TelegramConfig Create(
    string apiId,
    string apiHash,
    string phoneNumber)
    {
        return new TelegramConfig(apiId, apiHash, phoneNumber);
    }
}
