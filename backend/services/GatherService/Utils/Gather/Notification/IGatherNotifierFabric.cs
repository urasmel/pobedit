using System.Net.WebSockets;

namespace Gather.Utils.Gather.Notification;

public interface IGatherNotifierFabric
{
    IGatherNotifier Create();

    IGatherNotifier Create(WebSocket socket);
}
