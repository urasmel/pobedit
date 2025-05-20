using Gather.Models;
using Microsoft.EntityFrameworkCore;

namespace Gather.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("User ID=postgres;Password=;Host=localhost;Port=5432;Database=pobedit_db;Include Error Detail=true;");
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, Username = "firstUser", Password = "pass", PhoneNumber = "+79123456789" });


            modelBuilder.Entity<Channel>()
                .HasMany(e => e.Subscribers)
                .WithMany(e => e.SubscriptionChannels);


            modelBuilder.Entity<Channel>()
                .HasOne(e => e.Owner)
                .WithMany(e => e.Channels);

            modelBuilder.Entity<Group>()
                .HasMany(e => e.Subscribers)
                .WithMany(e => e.SubscriptionGroups);

            modelBuilder.Entity<Group>()
                .HasOne(e => e.Owner)
                .WithMany(e => e.Groups);

            modelBuilder.Entity<Post>()
                .HasMany(e => e.Comments)
                .WithOne(e => e.Post)
                .HasForeignKey(e => e.PostId)
                .HasPrincipalKey(e => e.TlgId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<User>? Users { get; set; }

        public DbSet<Account>? Accounts { get; set; }

        public DbSet<Channel>? Channels { get; set; }

        public DbSet<Group>? Groups { get; set; }

        public DbSet<Post>? Posts { get; set; }

        public DbSet<Comment>? Comments { get; set; }
    }
}
