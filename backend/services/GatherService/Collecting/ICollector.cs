using TL;

namespace GatherMicroservice.Collecting
{
    public interface ICollector
    {
        Task<bool> StartGather(List<ChatBase> chats);
        Task<bool> StopGather();
        Task<bool> GetStatus();
    }
}
