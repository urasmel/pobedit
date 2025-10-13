using System.ComponentModel.DataAnnotations;

namespace Gather.Dtos;

public record PobeditSettingsDto
{
    [Required]
    public DateTime StartGatherDate { get; set; }

    [Required]
    public int ChannelPollingFrequency { get; set; }

    [Required]
    public int CommentsPollingDelay { get; set; }
}
