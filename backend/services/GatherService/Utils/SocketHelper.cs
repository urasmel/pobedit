using System.Net.WebSockets;

namespace Gather.Utils
{
    public static class SocketHelper
    {
        public static async void SendAsyncMessage(WebSocket webSocket, string message)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(message);
            var arraySegment = new ArraySegment<byte>(bytes, 0, bytes.Length);

            await webSocket.SendAsync(
                arraySegment,
                WebSocketMessageType.Text,
                true,
                CancellationToken.None);
        }
    }
}
