using System.ComponentModel.DataAnnotations;

namespace Gather.Models;

public class PobeditSettings
{
    [Required]
    public DateTime StartGatherDate { get; set; }
}
