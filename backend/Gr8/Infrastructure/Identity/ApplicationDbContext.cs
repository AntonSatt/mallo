using Gr8.Domain.Entities;
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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().HasData(
                new ApplicationUser { FirstName = "Anna", LastName = "Larsson", UserName = "AnAl", PasswordHash = "Anna123!", Email = "anna@mail.com" }
                );
        }
    }
}
