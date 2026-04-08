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
        public DbSet<Comment> Comments => Set<Comment>();

        public CommunityDbContext(DbContextOptions<CommunityDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
