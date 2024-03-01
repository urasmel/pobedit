namespace SharedCore.Models
{
    public class Channel
    {
        public long Id { get; set; }
        // Идентификатор пользователя, который является подписчиком канала и под которым канал управляется в приложении.
        public User? User { get; set; }
        public bool IsChannel { get; set; }
        public bool IsGroup { get; set; }
        public string? MainUsername { get; set; }
        public string? Title { get; set; }
        public Account[]? Members { get; set; }
    }
}
