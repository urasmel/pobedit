using System.Text.Json.Serialization;

namespace Gather.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EventType
    {
        Connection,
        ServerRequestedUserData,
        ClientSentVerificationData
    }
}
