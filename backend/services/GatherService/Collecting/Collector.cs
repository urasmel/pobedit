using TL;

namespace Gather.Collecting
{
    public class Collector : ICollector
    {
        public async Task<bool> StartGather(List<ChatBase> chats)
        {
            await Task.Delay(100);
            throw new NotImplementedException();
        }

        public async Task<bool> StopGather()
        {
            await Task.Delay(100);
            throw new NotImplementedException();
        }

        public async Task<bool> GetStatus()
        {
            await Task.Delay(100);
            throw new NotImplementedException();
        }
    }
}
