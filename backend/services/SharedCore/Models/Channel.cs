using System.ComponentModel.DataAnnotations;

namespace SharedCore.Models
{
    public class Channel
    {
        public long Id { get; set; }
        // Идентификатор пользователя, который является подписчиком канала и под которым канал управляется в приложении.

        [Required]
        public Account? Owner { get; set; }
        public bool IsChannel { get; set; }
        public bool IsGroup { get; set; }
        public string? MainUsername { get; set; }
        public string? Title { get; set; }
        public Account[]? Members { get; set; }
        public string? Image {  get; set; }
        public string? About { get; set; } = string.Empty;
        public int ParticipantsCount { get; set; } = 0;
    }
}
