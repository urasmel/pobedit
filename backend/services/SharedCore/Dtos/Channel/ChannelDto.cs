using SharedCore.Models;

namespace SharedCore.Dtos.Channel
{
    public class ChannelDto
    {
        public long Id { get; set; }
        // Идентификатор пользователя, который является подписчиком канала и под которым канал управляется в приложении.
        public long UserID { get; set; }
        public bool IsChannel { get; set; }
        public bool IsGroup { get; set; }
        public string? MainUsername { get; set; }
        public string? Title { get; set; }
    }
}
