using System.ComponentModel.DataAnnotations;

namespace SharedCore.Models
{
    public class Post
    {
        [Key]
        public long PostId { get; set; }
        // Идентификатор поста в телеграме.
        public long Id {  get; set; }
        public long PeerId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public Comment[] Comments { get; set; } = new Comment[0];
    }
}
