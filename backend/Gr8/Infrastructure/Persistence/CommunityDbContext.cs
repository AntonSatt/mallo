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

        public CommunityDbContext(DbContextOptions<CommunityDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>().HasData(
                new Tag { Name = "Självskada" },
                new Tag { Name = "Ångest" },
                new Tag { Name = "Depression" },
                new Tag { Name = "Våld" },
                new Tag { Name = "Sexuella övergrepp" },
                new Tag { Name = "Missbruk" },
                new Tag { Name = "Trauma" },
                new Tag { Name = "Misshandel" },
                new Tag { Name = "Psykisk ohälsa" },
                new Tag { Name = "Mobbning" },
                new Tag { Name = "Abort" },
                new Tag { Name = "Graviditet" },
                new Tag { Name = "Barnlöshet" },
                new Tag { Name = "Missfall" },
                new Tag { Name = "IVF" },
                new Tag { Name = "Förlust" },
                new Tag { Name = "PSOS" },
                new Tag { Name = "Ätstörning" },
                new Tag { Name = "Suicidtankar" },
                new Tag { Name = "Relation" }
                );

            modelBuilder.Entity<Category>().HasData(
                new Category { Name = "Djur"},
                new Category { Name = "Generell" },
                new Category { Name = "Relation" }
                );

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().ToTable("AspNetUsers");

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
        }
    }
}
