using Gather.Models;

namespace Gather.Dtos;

public class PostDto
{
    public long TlgId { get; set; }

    public long PeerId { get; set; }

    public Account? Author { get; set; }

    public string? Message { get; set; }

    public DateTime Date { get; set; }

    public long CommentsCount { get; set; }
}
