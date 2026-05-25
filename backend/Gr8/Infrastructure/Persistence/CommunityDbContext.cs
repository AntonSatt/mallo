using Gr8.Domain.Entities;
using Gr8.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace Gr8.Infrastructure.Persistence
{
    public class CommunityDbContext : DbContext
    {
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Report> Reports => Set<Report>();
        public DbSet<Hug> Hugs => Set<Hug>();
        public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
        public DbSet<Activity> Activities => Set<Activity>();
        public DbSet<ActivityBookmark> ActivityBookmarks => Set<ActivityBookmark>();
        public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
        public DbSet<ActivityCalender> ActivityCalenders => Set<ActivityCalender>();

        public CommunityDbContext(DbContextOptions<CommunityDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Tag>().HasData(
                new Tag { Name = "Självskada", Id = 1 },
                new Tag { Name = "Ångest", Id = 2 },
                new Tag { Name = "Depression", Id = 3 },
                new Tag { Name = "Våld", Id = 4 },
                new Tag { Name = "Sexuella övergrepp", Id = 5 },
                new Tag { Name = "Missbruk", Id = 6 },
                new Tag { Name = "Trauma", Id = 7 },
                new Tag { Name = "Misshandel", Id = 8 },
                new Tag { Name = "Psykisk ohälsa", Id = 9 },
                new Tag { Name = "Mobbning", Id = 10 },
                new Tag { Name = "Abort", Id = 11 },
                new Tag { Name = "Graviditet", Id = 12 },
                new Tag { Name = "Barnlöshet", Id = 13 },
                new Tag { Name = "Missfall", Id = 14 },
                new Tag { Name = "IVF", Id = 15 },
                new Tag { Name = "Förlust", Id = 16 },
                new Tag { Name = "PCOS", Id = 17 },
                new Tag { Name = "Ätstörning", Id = 18 },
                new Tag { Name = "Suicidtankar", Id = 19 },
                new Tag { Name = "Relation", Id = 20 }
            );

            modelBuilder.Entity<Category>().HasData(
                new Category { Name = "Relationer", Id = 1 },
                new Category { Name = "Familj", Id = 2 },
                new Category { Name = "Sexualitet", Id = 3 },
                new Category { Name = "Psykisk hälsa", Id = 4 },
                new Category { Name = "Fysisk hälsa", Id = 5 },
                new Category { Name = "Samhälle", Id = 6 },
                new Category { Name = "Barn & ungdom", Id = 7 },
                new Category { Name = "Miljö", Id = 8 },
                new Category { Name = "Volontärarbete", Id = 9 },
                new Category { Name = "Djur", Id = 10 },
                new Category { Name = "Utbildning", Id = 11 },
                new Category { Name = "Generell", Id = 12 },
                new Category { Name = "Övrigt", Id = 13 }
            );

            // Map ApplicationUser to AspNetUsers table
            modelBuilder.Entity<ApplicationUser>().ToTable("AspNetUsers");

            // Configure many-to-many relationship between Post and Tag
            modelBuilder.Entity<Post>()
                .HasMany(p => p.Tags)
                .WithMany(t => t.Posts)
                .UsingEntity(j => j.ToTable("PostTags"));

            modelBuilder.Entity<ApplicationUser>()
                .HasMany(u => u.Tags)
                .WithMany()
                .UsingEntity(
                    "UserTags",
                    right => right
                        .HasOne(typeof(Tag))
                        .WithMany()
                        .HasForeignKey("TagId")
                        .HasPrincipalKey(nameof(Tag.Id))
                        .OnDelete(DeleteBehavior.Cascade),
                    left => left
                        .HasOne(typeof(ApplicationUser))
                        .WithMany()
                        .HasForeignKey("UserId")
                        .HasPrincipalKey(nameof(ApplicationUser.Id))
                        .OnDelete(DeleteBehavior.Cascade),
                    join =>
                    {
                        join.HasKey("UserId", "TagId");
                        join.ToTable("UserTags");
                    });

            // Configure one-to-many relationship between Category and Post
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Posts)
                .HasForeignKey(p => p.CategoryId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // Configure one-to-many relationship between ApplicationUser and Post
            modelBuilder.Entity<Post>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>(entity =>
               {
                   entity.HasOne<ApplicationUser>()
                       .WithMany()
                       .HasForeignKey(c => c.UserId)
                       .IsRequired()
                       .OnDelete(DeleteBehavior.Restrict);

                   entity.HasOne(c => c.Post)
                       .WithMany(p => p.Comments)
                       .HasForeignKey(c => c.PostId)
                       .IsRequired()
                       .OnDelete(DeleteBehavior.Cascade);

                   entity.HasOne(c => c.ParentComment)
                       .WithMany(c => c.Replies)
                       .HasForeignKey(c => c.ParentCommentId)
                       .OnDelete(DeleteBehavior.NoAction);
               });

            modelBuilder.Entity<Report>(entity =>
                {
                    entity.Property(r => r.Reason)
                    .IsRequired();

                    entity.Property(r => r.Status)
                    .IsRequired();

                    entity.Property(r => r.CreatedAt)
                    .IsRequired();

                    entity.HasOne<ApplicationUser>()
                    .WithMany()
                    .HasForeignKey(r => r.ReportedByUserId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                    entity.HasOne(r => r.Post)
                    .WithMany()
                    .HasForeignKey(r => r.PostId)
                    .OnDelete(DeleteBehavior.NoAction);

                    entity.HasOne(r => r.Comment)
                    .WithMany()
                    .HasForeignKey(r => r.CommentId)
                    .OnDelete(DeleteBehavior.NoAction);

                    entity.HasOne<ApplicationUser>()
                    .WithMany()
                    .HasForeignKey(r => r.ReviewedByAdminId)
                    .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity<Hug>(entity =>
            {
                entity.HasKey(h => h.Id);

                entity.HasOne(h => h.Post)
                .WithMany(p => p.Hugs)
                .HasForeignKey(h => h.PostId)
                .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(h => h.Comment)
                .WithMany(c => c.Hugs)
                .HasForeignKey(h => h.CommentId)
                .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

                //Ensures that a user can only hug a specific post/comment once.
                entity.HasIndex(h => new { h.UserId, h.PostId }).IsUnique();
                entity.HasIndex(h => new { h.UserId, h.CommentId }).IsUnique();
            });

            modelBuilder.Entity<Activity>(entity =>
            {
                entity.HasKey(a => a.Id);

                entity.Property(a => a.Title)
                .IsRequired();

                entity.Property(a => a.Description)
                .IsRequired();

                entity.Property(a => a.Latitude)
                .HasPrecision(18, 6)
                .IsRequired();

                entity.Property(a => a.Longitude)
                .HasPrecision(18, 6)
                .IsRequired();

                entity.ToTable(t => t.HasCheckConstraint("CK_Activity_Dates_NotDefault", "[StartAt] > '2000-01-01' AND [EndAt] > '2000-01-01'"));

                entity.ToTable(t => t.HasCheckConstraint("CK_Activity_EndAfterStart", "[EndAt] >= [StartAt]"));

                entity.Property(a => a.StartAt)
                .IsRequired();

                entity.Property(a => a.EndAt)
                .IsRequired();



                entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(a => new { a.Latitude, a.Longitude });
            });

            modelBuilder.Entity<Bookmark>(entity =>
            {
                entity.HasKey(b => b.Id);

                entity.HasOne(b => b.Post)
                .WithMany(p => p.Bookmarks)
                .HasForeignKey(b => b.PostId)
                .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(b => new { b.UserId, b.PostId }).IsUnique();
            });

            modelBuilder.Entity<ChatMessage>(entity => 
            {
                entity.HasKey(cm => cm.Id);

                entity.Property(cm => cm.Content)
                .IsRequired()
                .HasMaxLength(4000);

                entity.Property(cm => cm.SendAt)
                .IsRequired();

                entity.HasOne(cm => cm.Activity)
                .WithMany()
                .HasForeignKey(cm => cm.ActivityId)
                .OnDelete(DeleteBehavior.SetNull); //The chat can continue when the activity deletes. 

                entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(cm => cm.SenderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(cm => cm.ReceiverId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

                //Ensures fast loading of chat history by indexing the relationship between sender and receiver.
                entity.HasIndex(cm => new { cm.SenderId, cm.ReceiverId });
            });
            modelBuilder.Entity<ActivityCalender>(entity =>
            {
                entity.HasKey(ac => ac.Id);

                entity.HasOne(ac => ac.Activity)
                    .WithMany()
                    .HasForeignKey(ac => ac.ActivityId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<ApplicationUser>()
                    .WithMany()
                    .HasForeignKey(ac => ac.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(ac => new { ac.UserId, ac.ActivityId }).IsUnique();
            });
        }
    }
}
