using Gather.Utils.ConfigService;

namespace Gather.Client
{
    public class GatherClient : WTelegram.Client
    {
        public GatherClient(IConfigUtils configUtils) : base(configUtils.Config())
        {
        }
    }
}
