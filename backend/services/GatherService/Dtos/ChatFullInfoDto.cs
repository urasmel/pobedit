namespace GatherMicroservice.Dtos
{
    public class ChatFullInfoDto
    {
        public long ChatId { get; set; }
        public string About { get; set; } = string.Empty;
        public int ParticipantsCount { get; set; } = 0;
        public string ChatPhoto { get; set; } = string.Empty;
    }
}
