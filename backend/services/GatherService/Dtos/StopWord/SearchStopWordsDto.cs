using System.ComponentModel.DataAnnotations;

namespace Gather.Dtos;

public class SearchStopWordsDto
{
    [Required]
    public string Content { get; } = "";
}
