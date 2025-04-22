namespace Gather.Dtos;

public class GetUserDto
{
    public int UserId { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? PhoneNumber { set; get; }
}
