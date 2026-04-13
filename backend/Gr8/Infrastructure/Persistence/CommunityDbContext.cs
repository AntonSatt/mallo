using Gr8.Domain.Entities;
using Gr8.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Infrastructure.Persistence
{
    public class CommunityDbContext : DbContext
    {
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Report> Reports => Set<Report>();

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
                new Category { Name = "Djur", Id = 1 },
                new Category { Name = "Generell", Id = 2 },
                new Category { Name = "Relation", Id = 3 }
                );

            // Map ApplicationUser to AspNetUsers table
            modelBuilder.Entity<ApplicationUser>().ToTable("AspNetUsers");

            // Configure many-to-many relationship between Post and Tag
            modelBuilder.Entity<Post>()
                .HasMany(p => p.Tags)
                .WithMany(t => t.Posts)
                .UsingEntity(j => j.ToTable("PostTags"));

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
                    .OnDelete(DeleteBehavior.Cascade);

                    entity.HasOne(r => r.Comment)
                    .WithMany()
                    .HasForeignKey(r => r.CommentId)
                    .OnDelete(DeleteBehavior.Cascade);

                    entity.HasOne<ApplicationUser>()
                    .WithMany()
                    .HasForeignKey(r => r.ReviewedByAdminId)
                    .OnDelete(DeleteBehavior.Restrict);
                });
        }
    }
}
