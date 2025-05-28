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
    [JsonPropertyName("toPollingChannels")]
    public int ToPollingChannels { get; set; } = 0;

    [Required]
    [JsonPropertyName("toPollingComments")]
    public int ToPollingComments { get; set; } = 0;
}
