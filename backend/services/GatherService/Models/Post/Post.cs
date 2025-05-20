using System.ComponentModel.DataAnnotations;

namespace Gather.Models;

public class Post
{
    // TODO У постов в одном канале могут быть разные авторы????
    [Key]
    public long Id { get; set; }

    public long TlgId { get; set; }

    public Account? Author { get; set; }

    public long PeerId { get; set; }

    public Channel? Channel { get; set; }

    public string Message { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public IList<Comment> Comments { get; set; } = new List<Comment>();

    public long CommentsCount { get; set; }
}
