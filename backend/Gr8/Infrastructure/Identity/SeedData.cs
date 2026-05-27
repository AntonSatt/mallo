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

            var userId = "00000000-0000-0000-0000-000000000001";
            var appUser = await userManager.FindByIdAsync(userId);
            var appUserEmail = "Anna@mail.se";            

            if (appUser == null)
            {
                var newUser = new ApplicationUser
                {
                    Id = userId, // fixed id (optional)
                    UserName = "Anna",
                    NormalizedUserName = "ANNA",
                    Email = appUserEmail,
                    NormalizedEmail = appUserEmail.ToUpperInvariant(),
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
            return;
        }
    }
}