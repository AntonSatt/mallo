using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Gr8.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Gr8.Api.Endpoints
{
    public static class CommunityEndpoints
    {
        public static void MapCommunityEndpoints(WebApplication app)
        {
            app.MapGet("/forum/posts/{PostId}/comments/", async (int postId, ICommentService commentService) => 
                {
                    var comments = await commentService.GetCommentsByPostAsync(postId);

                    if (comments.Count == 0)
                    {
                        return Results.NoContent();
                    }

                    return Results.Ok(comments);
                })
                .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/forum/posts/{PostId}/comments", async (int postId, ICommentService commentService, UserManager<ApplicationUser> userManager, CommentDto commentDto, ClaimsPrincipal user) => 
                {
                    var context = new ValidationContext(commentDto);
                    var results = new List<ValidationResult>();

                    bool isValid = Validator.TryValidateObject(commentDto, context, results, true);

                    if (!isValid)
                    {
                        return Results.BadRequest(results);
                    }

                    var appUser = await userManager.GetUserAsync(user);

                    if (appUser == null)
                    {
                        return Results.Unauthorized();
                    }

                    var comment = await commentService.CreateAsync(commentDto, postId, appUser.Id);

                    return Results.Ok(comment); 

                }).RequireAuthorization(AuthorizationConstants.JwtOnly);
        }
    }
}