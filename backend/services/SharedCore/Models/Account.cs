namespace SharedCore.Models
{
    public class Account
    {
        public long Id { get; set; }
        public long TlgId { get; set; }
        public string? MainUsername { get; set; }
        public bool? IsActive { get; set; }
        public bool? isBot { get; set; }
        public string? Username {  get; set; }
        public string? Phone {  get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Bio { get; set; }
        public List<Channel> SubscriptionChannels { get; set; } = new List<Channel>();
        public List<Group> SubscriptionGroups { get; set; } = new List<Group>();
        public List<Channel> Channels { get; set; } = new List<Channel>();
        public List<Group> Groups { get; set; } = new List<Group>();
        public string? Photo { get; set; }
    }
}
