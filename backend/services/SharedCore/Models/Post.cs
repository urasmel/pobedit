namespace SharedCore.Models
{
    public class Post
    {
        public long Id { get; set; }
        public long PeerId { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public Account Account { get; }
    }
}
