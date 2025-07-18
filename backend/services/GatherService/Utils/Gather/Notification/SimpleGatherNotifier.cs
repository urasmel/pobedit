namespace Gather.Utils.Gather.Notification;

public class SimpleGatherNotifier : IGatherNotifier
{
    public Task<bool> CheckIsNeedStopAsync()
    {
        return Task.FromResult(false);
    }

    public Task NotifyFailureEndingAsync(string messsage)
    {
        return Task.FromResult(false);
    }

    public Task NotifyProgressAsync(string message)
    {
        return Task.FromResult(false);
    }

    public Task NotifySuccessEndingAsync(string message)
    {
        return Task.FromResult(false);
    }
}
