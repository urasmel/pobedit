namespace SharedCore.Dtos.Channel
{
    public class ChannelInfoDto
    {
        public long Id { get; set; }
        public string About { get; set; } = string.Empty;
        public int ParticipantsCount { get; set; } = 0;
        public string Photo { get; set; } = string.Empty;
    }
}
