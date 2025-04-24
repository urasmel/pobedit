using System.Text.Json.Serialization;

namespace Gather.Models;

public enum SearchType
{
    [JsonPropertyName("posts")]
    Posts,
    [JsonPropertyName("comments")]
    Comments
}

public class SearchQuery
{
    [JsonPropertyName("query")]
    public string Query { get; set; } = string.Empty;

    [JsonPropertyName("searchType")]
    public SearchType SearchType { get; set; } = SearchType.Posts;

    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }

    [JsonPropertyName("limit")]
    public int Limit { get; set; } = 10;

    [JsonPropertyName("offset")]
    public int Offset {  get; set; } = 0;
}
