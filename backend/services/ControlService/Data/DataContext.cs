using Microsoft.EntityFrameworkCore;
using SharedCore.Models;

namespace ControlService.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
           => optionsBuilder.UseNpgsql("User ID=postgres;Password=;Host=localhost;Port=5432;Database=pobedit_db;");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, Username = "firstUser", Password = "pass", PhoneNumber = "+79123456789" });
        }

        public DbSet<User>? Users { get; set; }
        public DbSet<Account>? Accounts { get; set; }
        public DbSet<Channel>? Channels { get; set; }
        public DbSet<Post>? Posts { get; set; }
    }

}
