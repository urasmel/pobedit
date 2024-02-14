using System.Text.Json.Serialization;

namespace GatherMicroservice.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EventType
    {
        Connection,
        ServerRequestedUserData,
        ClientSentVerificationData
    }
}
