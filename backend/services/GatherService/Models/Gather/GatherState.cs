using System.ComponentModel.DataAnnotations;

namespace Gather.Models.Gather;

public class GatherState
{
    [Required]
    public GatherProcessState State { get; set; } = GatherProcessState.Stopped;

    [Required]
    public int ToPollingChannelsSecs { get; set; } = 0;

    [Required]
    public int ToPollingCommentsSecs { get; set; } = 0;
}
