using System.Text.Json.Serialization;

namespace Gather.Models;

public enum SearchType
{
    [JsonPropertyName("posts")]
    Posts,
    [JsonPropertyName("comments")]
    Comments
}
