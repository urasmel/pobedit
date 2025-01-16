namespace SharedCore.Models
{
    public class Account
    {
        public long Id { get; set; } 
        public long TlgId { get; set; }
        public string? AccountName { get; set; }
        public string? Name { get; set; }
        public string? Bio { get; set; }
        public string? Avatar { get; set; }
    }
}
