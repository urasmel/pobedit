using Gather.Models;

namespace Gather.Dtos;

public class CommentDto
{
    public int Id { get; set; }

    public long TlgId { get; set; }

    public long PeerId { get; set; }

    public long PostId { get; set; }

    public Account? From { get; set; }

    public string Message { get; set; } = string.Empty;

    public DateTime Date { get; set; }

}
