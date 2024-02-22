namespace GatherMicroservice.Models
{
    public class MessageInfo
    {
        public int Id { get; set; }
        public int PeerId { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
    }
}
