namespace ControlService.Dtos.Account
{
    public class AddAccountDto
    {
        public string? Username { get; set; } = string.Empty;
        public string? Password { get; set; } = string.Empty;
        public string? PhoneNumber { set; get; }
    }
}
