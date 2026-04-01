using Gr8.Application.DTOs;
using Gr8.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Gr8.Api.Endpoints
{
    public static class IdentityEndpoints
    {
        /// <summary>
        /// Configures the application's HTTP request pipeline to include endpoints for identity-related operations such as authentication and user management.
        /// </summary>
        public static void MapIdentityEndpoints(WebApplication app)
        {
            app.MapPost("/register", async (UserManager<ApplicationUser> userManager, [FromBody] RegisterDto userDto) =>
                {
                    var user = new ApplicationUser
                    {
                        UserName = userDto.UserName,
                        FirstName = userDto.FirstName,
                        LastName = userDto.LastName,
                        Email = userDto.Email,
                        SocialNumber = userDto.SocialNumber
                    };

                    var result = await userManager.CreateAsync(user, userDto.Password);

                    //TODO: Implement token generation logic after successful registration.
                    if (result.Succeeded)
                    {
                        return Results.Ok("User registered successfully.");
                    }
                    else
                    {
                        return Results.BadRequest(result.Errors);
                    }
                });

            app.MapPost("/login", async (SignInManager<ApplicationUser> signInManager, [FromBody] LoginDto loginDto) =>
                {
                    var result = await signInManager.PasswordSignInAsync(loginDto.UserName, loginDto.Password, false, false);

                    //TODO: Implement token generation logic after successful login.
                    if (result.Succeeded)
                    {
                        return Results.Ok("User logged in successfully.");
                    }
                    else
                    {
                        return Results.BadRequest("Invalid login attempt.");
                    }
                });

            app.MapPost("/logout", async (SignInManager<ApplicationUser> signInManager) =>
                {
                    //TODO: Implement token revocation logic in frontend.
                    await signInManager.SignOutAsync();
                    return Results.Ok("User logged out successfully.");
                });
        }
    }
}