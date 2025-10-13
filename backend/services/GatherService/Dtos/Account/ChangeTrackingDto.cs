using System.Text.Json.Serialization;

namespace Gather.Dtos;

public class ChangeTrackingDto
{
    [JsonPropertyName("is_tracking")]
    public bool IsTracking { get; set; }
}
