using System.Net.WebSockets;

namespace Gather.Utils.Gather.Notification;

public class GatherNotifierFabric : IGatherNotifierFabric
{
    public IGatherNotifier Create()
    {
        return new SimpleGatherNotifier();
    }

    public IGatherNotifier Create(WebSocket socket)
    {
        return new WebSocketGatherNotifier(socket);
    }
}
