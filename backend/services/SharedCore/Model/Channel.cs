namespace SharedCore.Model
{
    public class Channel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
        public string InviteLink { get; set; }
        public byte[] Icon { get; set; }
        public Account[] Members { get; set; }
    }
}
