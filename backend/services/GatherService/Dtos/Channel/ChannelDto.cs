using Gather.Models;

namespace Gather.Dtos;

public class ChannelDto
{
    public long TlgId { get; set; }

    // Идентификатор пользователя, который является подписчиком канала и под которым канал управляется в приложении.
    public Account? Owner { get; set; }

    public string? MainUsername { get; set; }

    public string? Title { get; set; }

    public string About { get; set; } = string.Empty;

    public int ParticipantsCount { get; set; } = 0;

    public string Image { get; set; } = string.Empty;
}
