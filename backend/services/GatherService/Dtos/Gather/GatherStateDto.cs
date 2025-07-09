using Gather.Models.Gather;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Gather.Dtos.Gather;

public class GatherStateDto
{
    [Required]
    [JsonPropertyName("state")]
    public GatherProcessState State { get; set; } = GatherProcessState.Stopped;

    [Required]
    [JsonPropertyName("toPollingChannelsSecs")]
    public int ToPollingChannelsSecs { get; set; } = 0;

    [Required]
    [JsonPropertyName("toPollingCommentsSecs")]
    public int ToPollingCommentsSecs { get; set; } = 0;
}
