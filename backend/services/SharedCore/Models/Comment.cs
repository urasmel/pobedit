namespace SharedCore.Models;

public class Comment
{
    // DB
    public long Id { get; set; }

    // Идентификатор комментария в телеграмме.
    public long TlgId { get; set; }


    // Идентификатор канала в телеграмме, в котором опубликован пост.
    public long PeerId {  get; set; }

    public long PostId {  get; set; }

    public Account? From { get; set; }

    public string Message { get; set; } = string.Empty;

    public DateTime Date { get; set; }
}
