namespace Gather.Models;

public class Channel
{
    public long Id { get; set; }

    public long TlgId { get; set; }

    public Account? Owner { get; set; }

    public string? MainUsername { get; set; }

    public string? Title { get; set; }

    public IList<Account> Subscribers { get; set; } = new List<Account>();

    public IList<Post> Posts { get; set; } = new List<Post>();

    public string? Image {  get; set; }

    public string? About { get; set; } = string.Empty;

    public int ParticipantsCount { get; set; } = 0;
}
