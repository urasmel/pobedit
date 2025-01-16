using SharedCore.Models;

namespace SharedCore.Dtos
{
    public class PostDto
    {
        public long Id { get; set; }
        public long PeerId { get; set; }
        public string? Message { get; set; }
        public DateTime Date { get; set; }
        public Comment[] Comments { get; set; } = new Comment[0];
    }
}
