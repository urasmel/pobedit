using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Gather.Models;

public class Account
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("tlg_id")]
    public long? TlgId { get; set; }

    [JsonPropertyName("main_username")]
    public string MainUsername { get; set; } = string.Empty;

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

    [JsonIgnore]
    public List<Channel> SubscriptionChannels { get; set; } = new();

    [JsonIgnore]
    public List<Group> SubscriptionGroups { get; set; } = new();

    [JsonIgnore]
    public List<Channel> Channels { get; set; } = new();

    [JsonIgnore]
    public List<Group> Groups { get; set; } = new();

    [JsonPropertyName("photo")]
    public string? Photo { get; set; }
}
