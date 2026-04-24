using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace Gr8.Api.Endpoints
{
    public static class IdentityEndpoints
    {
        /// <summary>
        /// Configures the application's HTTP request pipeline to include endpoints for identity-related operations such as authentication and user management.
        /// </summary>
        public static void MapIdentityEndpoints(WebApplication app)
        {
            app.MapPost("/register", async (UserManager<ApplicationUser> userManager, IJwtTokenGenerator jwtGenerator, [FromBody] RegisterDto userDto) =>
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

                    return Results.Ok(new { Token = token, Message = "User registered successfully." });
                });

            app.MapPost("/login", async (UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IJwtTokenGenerator jwtGenerator, [FromBody] LoginDto loginDto) =>
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

            app.MapPost("/logout", async (SignInManager<ApplicationUser> signInManager) =>
                {
                    await signInManager.SignOutAsync();
                    return Results.Ok("User logged out successfully.");
                });

            app.MapDelete("/delete", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user) =>
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

            app.MapGet("/user", async (UserManager<ApplicationUser> userManger, ClaimsPrincipal user) =>
            {
                var appUser = await userManger.GetUserAsync(user);

                if(appUser == null)
                {
                    return Results.NotFound("User not found");
                }

                var userDto = new UserDto{
                    Email = appUser.Email,
                    FirstName = appUser.FirstName,
                    LastName = appUser.LastName,
                    UserName = appUser.UserName
                };

                return Results.Ok(userDto); 
                
            })
             .RequireAuthorization(AuthorizationConstants.JwtOnly); 

            app.MapPut("/user", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromBody] UpdateProfileDto updateProfileDto) =>
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

            app.MapPatch("/password", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromBody] UpdatePasswordDto updatePasswordDto) =>
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
        }
    }
}