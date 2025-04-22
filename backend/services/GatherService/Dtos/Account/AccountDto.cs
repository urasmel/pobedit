using Gather.Models;
using System.Text.Json.Serialization;

namespace Gather.Dtos;

public class AccountDto
{
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
