using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace Gr8.Infrastructure.Identity
{
    public static class SeedData
    {
        public static async Task EnsureSeedDataAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var userEmail = "anna@mail.com";
            var appUser = await userManager.FindByEmailAsync(userEmail);

            var adminEmail = "sebastian.enerstrand@chasacademy.se";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (appUser == null)
            {
                var newUser = new ApplicationUser
                {
                    Id = "00000000-0000-0000-0000-000000000001", // fixed id (optional)
                    UserName = "Anna",
                    NormalizedUserName = "ANNA",
                    Email = userEmail,
                    NormalizedEmail = userEmail.ToUpperInvariant(),
                    FirstName = "Anna",
                    LastName = "Larsson",
                    SocialNumber = "19930401",
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ConcurrencyStamp = Guid.NewGuid().ToString("D"),
                    Avatar = 5
                };

                var result = await userManager.CreateAsync(newUser, "Anna123!");
                if (!result.Succeeded)
                {
                    throw new Exception($"Failed to create seed user: {string.Join(';', result.Errors)}");
                }
            }

            if (adminUser == null)
            {
                var newUser = new ApplicationUser
                {
                    Id = "00000000-0000-0000-0000-000000000002", // fixed id (optional)
                    UserName = "Admin",
                    NormalizedUserName = "ADMIN",
                    Email = adminEmail,
                    NormalizedEmail = adminEmail.ToUpperInvariant(),
                    FirstName = "Admin",
                    LastName = "Adminsson",
                    SocialNumber = "19700101",
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ConcurrencyStamp = Guid.NewGuid().ToString("D"),
                    Avatar = 9
                };

                var result = await userManager.CreateAsync(newUser, "Admin123!");
                if (!result.Succeeded)
                {
                    throw new Exception($"Failed to create seed user: {string.Join(';', result.Errors)}");
                }
            }

            return;
        }
    }
}