using GatherMicroservice.Utils;

namespace GatherMicroservice.Client
{
    public class GatherClient : WTelegram.Client
    {
        public GatherClient(IConfigUtils configUtils) : base(configUtils.Config())
        { }
    }
}
