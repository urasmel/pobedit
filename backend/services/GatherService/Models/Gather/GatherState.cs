using System.ComponentModel.DataAnnotations;

namespace Gather.Models.Gather;

public class GatherState
{
    [Required]
    public GatherProcessState State { get; set; } = GatherProcessState.Stopped;

    [Required]
    public int ToPollingChannels { get; set; }=0;

    [Required]
    public int ToPollingComments { get; set; } = 0;
}
