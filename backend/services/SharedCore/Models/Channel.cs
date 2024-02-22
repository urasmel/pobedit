namespace SharedCore.Models
{
    public class Channel
    {
        public int Id { get; set; }
        public bool IsChannel { get; set; }
        public bool IsGroup { get; set; }
        public string MainUsername { get; set; }
        public string Title { get; set; }
        public Account[] Members { get; set; }
    }
}
