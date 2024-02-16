namespace SharedCore.Model
{
    public class Post
    {
        public int Id { get; set; }
        public Channel Channel { get; set; }
        public DateTime Created { get; set; }
        public string Text {  get; set; }
    }
}
