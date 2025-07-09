namespace Gather.Services.Gather;

public class BackgroundTask
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Description { get; set; } = string.Empty;

    public DateTime EnqueuedAt { get; set; } = DateTime.UtcNow;
}
