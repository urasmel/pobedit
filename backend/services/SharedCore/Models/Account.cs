namespace SharedCore.Models
{
    public class Account
    {
        public long Id { get; set; }
        public long TlgId { get; set; }
        public string? MainUsername { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsBot { get; set; }
        public string? Username {  get; set; }
        public string? Phone {  get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Bio { get; set; }
        public List<Channel> SubscriptionChannels { get; set; } = [];
        public List<Group> SubscriptionGroups { get; set; } = [];
        public List<Channel> Channels { get; set; } = [];
        public List<Group> Groups { get; set; } = [];
        public string? Photo { get; set; }
    }
}
