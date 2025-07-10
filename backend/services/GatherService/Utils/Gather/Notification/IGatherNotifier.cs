namespace Gather.Utils.Gather.Notification;

public interface IGatherNotifier
{
    Task NotifySuccessEndingAsync(string message);

    Task NotifyFailureEndingAsync(string messsage);

    Task NotifyProgressAsync(string message);

    Task<bool> CheckIsNeedStopAsync();
}
