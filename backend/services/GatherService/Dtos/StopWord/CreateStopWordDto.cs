using System.ComponentModel.DataAnnotations;

namespace Gather.Dtos;

public class CreateStopWordDto
{
    [Required]
    public string Word { get; set; } = "";

    [Required]
    public DateOnly CreatedAt { set; get; }
}
