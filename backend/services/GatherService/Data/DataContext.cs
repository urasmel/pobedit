using Microsoft.EntityFrameworkCore;
using SharedCore.Model;

namespace GatherMicroservice.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Post> Posts { get; set; }
    }
}
