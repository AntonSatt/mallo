using Gr8.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Gr8.Infrastructure.Identity
{
    /// <summary>
    /// Represents the Entity Framework Core database context for the application, configured to use ASP.NET Core
    /// Identity with the specified user type.
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Ignore(u => u.Tags);

                entity.Property(u => u.Avatar)
                    .HasDefaultValue(1);

                entity.Property(u => u.IsAnonymousPosting)
                    .HasDefaultValue(true);

                entity.ToTable(t =>
                    t.HasCheckConstraint("CK_AspNetUsers_Avatar_Range", "[Avatar] BETWEEN 1 AND 9"));
            });
        }
    }
}
