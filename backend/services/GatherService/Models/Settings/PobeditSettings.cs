using System.ComponentModel.DataAnnotations;

namespace Gather.Models;

public class PobeditSettings
{
    [Required]
    public DateTime StartGatherTime { get; set; }
}
