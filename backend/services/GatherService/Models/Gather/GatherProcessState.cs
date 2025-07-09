using System.Text.Json.Serialization;

namespace Gather.Models.Gather;

public enum GatherProcessState
{
    [JsonPropertyName("stopped")]
    Stopped,
    [JsonPropertyName("running")]
    Running,
    [JsonPropertyName("paused")]
    Paused
}
