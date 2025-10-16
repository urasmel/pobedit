using System.ComponentModel.DataAnnotations;

namespace Gather.Models;

public class StopWord
{
    public long Id { get; set; }

    [Required]
    public string Word { get; set; } = "";

    [Required]
    public DateOnly CreatedAt { set; get; }
}
