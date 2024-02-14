namespace ControlService.Dtos.Account
{
    public class AccountLoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PhoneNumber { get; set; }=string.Empty;
    }
}
