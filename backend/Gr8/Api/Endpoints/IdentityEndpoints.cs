using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
using Gr8.Application.interfaces;
using Gr8.Infrastructure.Persistence;
using Gr8.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Gr8.Api.Endpoints
{
    public static class IdentityEndpoints
    {
        /// <summary>
        /// Configures the application's HTTP request pipeline to include endpoints for identity-related operations such as authentication and user management.
        /// </summary>
        public static void MapIdentityEndpoints(WebApplication app)
        {
            app.MapPost("/auth/register", async (UserManager<ApplicationUser> userManager, IJwtTokenGenerator jwtGenerator, [FromBody] RegisterDto userDto) =>
                {
                    var context = new ValidationContext(userDto);
                    var results = new List<ValidationResult>();

                    bool isValid = Validator.TryValidateObject(userDto, context, results, true);

                    if (!isValid)
                    {
                        return Results.BadRequest(results);
                    }

                    var user = new ApplicationUser
                    {
                        UserName = userDto.UserName,
                        FirstName = userDto.FirstName,
                        LastName = userDto.LastName,
                        Email = userDto.Email,
                        SocialNumber = userDto.SocialNumber
                    };

                    var result = await userManager.CreateAsync(user, userDto.Password);

                    if (!result.Succeeded)
                    {
                        return Results.BadRequest(result.Errors);
                    }

                    var token = jwtGenerator.GenerateToken(user.Id, user.Email, user.UserName!);

                    return Results.Created($"/users/{user.Id}", new { Token = token, User = new { user.Id, user.UserName, user.Email } });
                });

            app.MapPost("/auth/login", async (UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IJwtTokenGenerator jwtGenerator, [FromBody] LoginDto loginDto) =>
                {
                    var context = new ValidationContext(loginDto);
                    var results = new List<ValidationResult>();

                    bool isValid = Validator.TryValidateObject(loginDto, context, results, true);

                    if (!isValid)
                    {
                        return Results.BadRequest(results);
                    }

                    var result = await signInManager.PasswordSignInAsync(loginDto.UserName, loginDto.Password, false, false);

                    if (!result.Succeeded)
                    {
                        return Results.Unauthorized();
                    }

                    var user = await userManager.FindByNameAsync(loginDto.UserName);

                    if (user == null)
                    {
                        return Results.Unauthorized();
                    }

                    var token = jwtGenerator.GenerateToken(user.Id, user.Email!, user.UserName!);

                    return Results.Ok(new { Token = token, Message = "User logged in successfully." });
                });

            app.MapPost("/auth/logout", async (SignInManager<ApplicationUser> signInManager) =>
                {
                    await signInManager.SignOutAsync();
                    return Results.Ok("User logged out successfully.");
                });

            app.MapDelete("/users/me", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user) =>
                {
                    var appUser = await userManager.GetUserAsync(user);
                    if (appUser == null)
                    {
                        return Results.NotFound("User not found.");
                    }
                    var result = await userManager.DeleteAsync(appUser);

                    return result.Succeeded
                        ? Results.Ok("User deleted successfully.")
                        : Results.BadRequest(result.Errors);
                })
                .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/users/me", async (UserManager<ApplicationUser> userManger, ClaimsPrincipal user) =>
            {
                var appUser = await userManger.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.NotFound("User not found");
                }

                var userDto = new UserDto
                {
                    Email = appUser.Email,
                    FirstName = appUser.FirstName,
                    LastName = appUser.LastName,
                    UserName = appUser.UserName
                };

                return Results.Ok(userDto);

            })
             .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPut("/users/me", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromBody] UpdateProfileDto updateProfileDto) =>
                {
                    var appUser = await userManager.GetUserAsync(user);

                    if (appUser == null)
                    {
                        return Results.NotFound("User not found.");
                    }

                    appUser.UserName = updateProfileDto.Username;
                    appUser.FirstName = updateProfileDto.FirstName;
                    appUser.LastName = updateProfileDto.LastName;
                    appUser.Email = updateProfileDto.Email;

                    var changedProfil = await userManager.UpdateAsync(appUser);

                    if (changedProfil.Succeeded)
                    {
                        return Results.Ok("User updated successfully");
                    }

                    var isDuplicate = changedProfil.Errors.Any(e => e.Code.Contains("DuplicateUserName") || e.Code.Contains("DuplicateEmail"));

                    if (isDuplicate)
                    {
                        return Results.Conflict(changedProfil.Errors);
                    }

                    return Results.BadRequest(changedProfil.Errors);
                })
                .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPatch("/users/me/password", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromBody] UpdatePasswordDto updatePasswordDto) =>
                {
                    var appUser = await userManager.GetUserAsync(user);

                    if (appUser == null)
                    {
                        return Results.NotFound("User not found.");
                    }

                    var context = new ValidationContext(updatePasswordDto);
                    var results = new List<ValidationResult>();

                    bool isValid = Validator.TryValidateObject(updatePasswordDto, context, results, true);

                    if (!isValid)
                    {
                        return Results.BadRequest(results.Select(r => r.ErrorMessage));
                    }

                    var changedPassword = await userManager.ChangePasswordAsync(appUser, updatePasswordDto.CurrentPassword, updatePasswordDto.NewPassword);

                    return changedPassword.Succeeded
                    ? Results.Ok("Password updated successfully")
                    : Results.BadRequest(changedPassword.Errors.Select(e => e.Description));
                })
                .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/auth/forgot-password", async (ForgotPasswordDto forgotPasswordDto, CommunityDbContext dbContext, UserManager<ApplicationUser> userManager, [FromServices] IEmailService emailService, [FromServices] IConfiguration configuration) =>
            {
                var user = await userManager.FindByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    return Results.Ok();
                }

                var token = await userManager.GeneratePasswordResetTokenAsync(user);

                var resetToken = new PasswordResetToken
                {
                    UserId = user.Id,
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddHours(1)
                };

                dbContext.PasswordResetTokens.Add(resetToken);
                await dbContext.SaveChangesAsync();

                var appLink = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                              ?? new[] { "http://localhost:5173" };
                var resetLink = $"{appLink[0]}/reset-password?token={Uri.EscapeDataString(token)}";

                await emailService.SendAsync(
                    user.Email,
                    "Önskan att återställa lösenord", $"<p>Du har begärt att återställa ditt lösenord. Klicka <a href='{resetLink}'>here</a> för att återställa ditt Lösenord. Länken går ut om 60 min.</p>");
                Console.WriteLine("det funkar");
                return Results.Ok("Om en användare med den e-postadressen finns, har en återställningslänk skickats.");
            });

            app.MapPost("/auth/reset-password", async (ResetPasswordDto resetPasswordDto, CommunityDbContext dbContext, UserManager<ApplicationUser> userManager) =>
            {
                var resetToken = await dbContext.PasswordResetTokens
                    .FirstOrDefaultAsync(t =>
                        t.Token == resetPasswordDto.Token &&
                        !t.Used &&
                        t.ExpiresAt > DateTime.UtcNow);

                if (resetToken == null)
                    return Results.BadRequest("Invalid or expired token.");

                var user = await userManager.FindByIdAsync(resetToken.UserId);

                if (user == null)
                    return Results.NotFound("User not found.");

                var result = await userManager.ResetPasswordAsync(user, resetToken.Token, resetPasswordDto.NewPassword); // 👈 fixed

                if (!result.Succeeded)
                    return Results.BadRequest(result.Errors.Select(e => e.Description));

                resetToken.Used = true;
                await dbContext.SaveChangesAsync();

                return Results.Ok("Password reset successfully.");
            });
        }
    }
}