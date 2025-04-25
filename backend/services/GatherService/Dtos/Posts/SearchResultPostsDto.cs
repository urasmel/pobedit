using System.Text.Json.Serialization;

namespace Gather.Dtos.Posts
{
    public class SearchResultPostsDto
    {
        [JsonPropertyName("totalCount")]
        public int TotalCount { get; set; } = 0;

        [JsonPropertyName("data")]
        public IEnumerable<PostDto> Data { get; set; } = [];
    }
}
