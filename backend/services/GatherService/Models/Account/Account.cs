//namespace SharedCore.Models
//{
//    public class Account
//    {
//        public long Id { get; set; }
//        public long TlgId { get; set; }
//        public string? MainUsername { get; set; }
//        public bool? IsActive { get; set; }
//        public bool? IsBot { get; set; }
//        public string? Username {  get; set; }
//        public string? Phone {  get; set; }
//        public string? FirstName { get; set; }
//        public string? LastName { get; set; }
//        public string? Bio { get; set; }
//        public List<Channel> SubscriptionChannels { get; set; } = [];
//        public List<Group> SubscriptionGroups { get; set; } = [];
//        public List<Channel> Channels { get; set; } = [];
//        public List<Group> Groups { get; set; } = [];
//        public string? Photo { get; set; }
//    }
//}
using System.Text.Json.Serialization;

namespace Gather.Models;

public class Account
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("tlg_id")]
    public long TlgId { get; set; }

    [JsonPropertyName("main_username")]
    public string? MainUsername { get; set; }

    [JsonPropertyName("is_active")]
    public bool? IsActive { get; set; }

    [JsonPropertyName("is_bot")]
    public bool? IsBot { get; set; }

    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    [JsonPropertyName("bio")]
    public string? Bio { get; set; }

    //[JsonPropertyName("subscription_channels")]
    [JsonIgnore]
    public List<Channel> SubscriptionChannels { get; set; } = new();

    //[JsonPropertyName("subscription_groups")]
    [JsonIgnore]
    public List<Group> SubscriptionGroups { get; set; } = new();

    //[JsonPropertyName("channels")]
    [JsonIgnore]
    public List<Channel> Channels { get; set; } = new();

    //[JsonPropertyName("groups")]
    [JsonIgnore]
    public List<Group> Groups { get; set; } = new();

    [JsonPropertyName("photo")]
    public string? Photo { get; set; }
}
