
using ControlService.Models;
using Microsoft.EntityFrameworkCore;

namespace ControlService.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
           => optionsBuilder.UseNpgsql("User ID=postgres;Password=;Host=localhost;Port=5432;Database=pobedit;");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>().HasData(
                new Account { Id = 1, Username = "firstUser", Password = "pass", PhoneNumber = "+79123456789" });
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Account> Channel { get; set; }
    }

}
