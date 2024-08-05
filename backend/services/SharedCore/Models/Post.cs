using System.ComponentModel.DataAnnotations;

namespace SharedCore.Models
{
    public class Post
    {
        public long PostId { get; set; }
        public long PeerId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        [Required]
        public Account Account { get; }
        public Comment[] Comments { get; set; } = new Comment[0];
    }
}
