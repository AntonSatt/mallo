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
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = "Anna",
                LastName = "Larsson",
                UserName = "AnAl",
                NormalizedUserName = "ANAL",
                Email = "anna@mail.com",
                NormalizedEmail = "ANNA@MAIL.COM",
                SocialNumber = "19930401",
                SecurityStamp = Guid.NewGuid().ToString("D"),
                ConcurrencyStamp = Guid.NewGuid().ToString("D"),
                EmailConfirmed = true
            };

            var hasher = new PasswordHasher<ApplicationUser>();
            user.PasswordHash = hasher.HashPassword(user, "Anna123!");

            modelBuilder.Entity<ApplicationUser>().HasData(user);
        }
    }
}
