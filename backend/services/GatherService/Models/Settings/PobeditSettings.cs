using System.ComponentModel.DataAnnotations;

namespace Gather.Models;

public record PobeditSettings
{
    [Required]
    public DateTime StartGatherDate { get; set; }

    [Required]
    public int ChannelPollingFrequency { get; set; }

    [Required]
    public int CommentsPollingDelay { get; set; }
}
