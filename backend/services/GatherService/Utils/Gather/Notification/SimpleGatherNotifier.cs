namespace Gather.Utils.Gather.Notification;

public class SimpleGatherNotifier : IGatherNotifier
{
    public Task<bool> CheckIsNeedStopAsync()
    {
        throw new NotImplementedException();
    }

    public Task NotifyFailureEndingAsync(string messsage)
    {
        throw new NotImplementedException();
    }

    public Task NotifyProgressAsync(string message)
    {
        throw new NotImplementedException();
    }

    public Task NotifySuccessEndingAsync(string message)
    {
        throw new NotImplementedException();
    }
}
