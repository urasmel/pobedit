using System.ComponentModel.DataAnnotations;

namespace Gather.Dtos;


public class StopWordDto
{
    public long Id { get; set; }

    [Required]
    public string Word { get; set; } = "";

    [Required]
    public DateTime CreatedAt { set; get; }
}
