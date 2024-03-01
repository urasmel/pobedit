namespace SharedCore.Dtos.Channel
{
    public class ChannelFullInfoDto
    {
        public long ChatId { get; set; }
        public string About { get; set; } = string.Empty;
        public int ParticipantsCount { get; set; } = 0;
        public string ChatPhoto { get; set; } = string.Empty;
    }
}
