namespace ControlService.Models
{
    public class Account
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { set; get; }
        public string? Info {  get; set; }
        public byte[]? Icon { get; set; }
    }
}
