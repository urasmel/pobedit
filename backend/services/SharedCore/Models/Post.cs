namespace SharedCore.Models
{
    public class Post
    {
        public int Id { get; set; }
        public int PeerId { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public User User { get; }
    }
}
