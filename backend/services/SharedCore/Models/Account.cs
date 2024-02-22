namespace SharedCore.Models
{
    public class Account
    {
        public int Id { get; set; }
        // @something
        public string? Username { get; set; }
        // Something not unique
        public string? Name { get; set; }
        public string? Bio { get; set; }
    }
}
