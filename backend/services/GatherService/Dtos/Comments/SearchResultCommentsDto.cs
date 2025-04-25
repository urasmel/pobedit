using System.Text.Json.Serialization;

namespace Gather.Dtos.Comments
{
    public class SearchResultCommentsDto
    {
        [JsonPropertyName("totalCount")]
        public int TotalCount { get; set; } = 0;

        [JsonPropertyName("data")]
        public IEnumerable<CommentDto> Data { get; set; } = [];
    }
}
