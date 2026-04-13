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

            var email = "anna@mail.com";
            var user = await userManager.FindByEmailAsync(email);
            if (user != null) return;

            var newUser = new ApplicationUser
            {
                Id = "00000000-0000-0000-0000-000000000001", // fixed id (optional)
                UserName = "AnAl",
                NormalizedUserName = "ANAL",
                Email = email,
                NormalizedEmail = email.ToUpperInvariant(),
                FirstName = "Anna",
                LastName = "Larsson",
                SocialNumber = "19930401",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("D"),
                ConcurrencyStamp = Guid.NewGuid().ToString("D")
            };

            var result = await userManager.CreateAsync(newUser, "Anna123!");
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create seed user: {string.Join(';', result.Errors)}");
            }
        }
    }
}