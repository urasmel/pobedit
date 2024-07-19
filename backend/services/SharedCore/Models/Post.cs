namespace SharedCore.Models
{
    public class Post
    {
        public long PostId { get; set; }
        public long PeerId { get; set; }
        public string Message { get; set; }=string.Empty;
        public DateTime Date { get; set; }
        public Account Account { get; }
    }
}
