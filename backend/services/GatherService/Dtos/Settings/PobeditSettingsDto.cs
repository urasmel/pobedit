using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Gather.Dtos;

public class PobeditSettingsDto
{
    [Required]
    public DateTime StartGatherDate { get; set; }
}
