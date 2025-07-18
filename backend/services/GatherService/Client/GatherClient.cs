using Gather.Utils.ConfigService;
using WTelegram;

namespace Gather.Client
{
    public class GatherClient : WTelegram.Client
    {
        public GatherClient(IConfigUtils configUtils) : base(configUtils.Config())
        {
            //_client.Session = Session.FromBytes(File.ReadAllBytes("session.dat").Deserialize());
        }
    }
}
