using System.Net.WebSockets;

namespace Gather.Utils.Gather.Notification;

public class WebSocketGatherNotifier : IGatherNotifier
{
    private WebSocket _webSocket;

    public WebSocketGatherNotifier(WebSocket webSocket)
    {
        if (webSocket == null) throw new ArgumentNullException("WebSocket is null");

        if (webSocket.State == WebSocketState.Closed) throw new ArgumentException("WebSocket is closed");
        _webSocket = webSocket;
    }

    public async Task<bool> CheckIsNeedStopAsync()
    {
        var buffer = new byte[1024 * 4];
        var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        if (result.MessageType == WebSocketMessageType.Close)
        {
            return true;
        }
        return false;
    }

    public async Task NotifyFailureEndingAsync(string messsage)
    {
        await _webSocket.CloseAsync(
            WebSocketCloseStatus.InternalServerError,
            messsage,
            CancellationToken.None);
    }

    public async Task NotifyProgressAsync(string message)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(message);
        var arraySegment = new ArraySegment<byte>(bytes, 0, bytes.Length);

        await _webSocket.SendAsync(
            arraySegment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
    }

    public async Task NotifySuccessEndingAsync(string message)
    {
        if (_webSocket != null &&
            (_webSocket.State == WebSocketState.Open ||
            _webSocket.State == WebSocketState.CloseReceived))
        {
            await _webSocket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                message,
                CancellationToken.None);
        }
    }
}
