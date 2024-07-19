namespace SharedCore.Dtos.Channel
{
    public class ChannelFullInfoDto
    {
        public long ChannelId { get; set; }
        public string About { get; set; } = string.Empty;
        public int ParticipantsCount { get; set; } = 0;
        public string ChannelPhoto { get; set; } = string.Empty;
    }
}
