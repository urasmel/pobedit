namespace SharedCore.Dtos.User
{
    public class GetUserDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { set; get; }
    }
}
