namespace ControlService.Dtos.Account
{
    public class GetAccountDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { set; get; }
    }
}
