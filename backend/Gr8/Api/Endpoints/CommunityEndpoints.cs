using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Gr8.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Validation;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Gr8.Api.Endpoints
{
    public static class CommunityEndpoints
    {
        public static void MapCommunityEndpoints(WebApplication app)
        {
            app.MapGet("/forum/posts", async ([FromServices] IPostService postService) =>
            {
                var posts = await postService.GetAllPostsAsync();

                if (posts.Count == 0)
                {
                    return Results.NoContent();
                }

                return Results.Ok(posts);
            })
             .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/forum/posts", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IPostService postService, [FromBody] PostDto postDto) =>
                {
                    var appUser = await userManager.GetUserAsync(user);
                    if (appUser == null)
                    {
                        return Results.NotFound("User not found.");
                    }

                    var context = new ValidationContext(postDto);
                    var results = new List<ValidationResult>();

                    bool isValid = Validator.TryValidateObject(postDto, context, results, true);

                    if (!isValid)
                    {
                        return Results.BadRequest(results);
                    }

                    var result = await postService.CreateAsync(postDto, appUser.Id);
                    if (result != null)
                    {
                        return Results.Ok(result);
                    }

                    return Results.BadRequest("Failed to create post.");
                })
                .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/posts/{PostId}/comments/", async ([FromServices] ICommentService commentService, int postId) =>
            {
                var comments = await commentService.GetCommentsByPostAsync(postId);

                if (comments.Count == 0)
                {
                    return Results.NoContent();
                }

                return Results.Ok(comments);
            })
              .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/forum/posts/{PostId}/comments", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] ICommentService commentService, [FromBody] CommentDto commentDto, int postId) =>
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

            app.MapPost("/forum/report", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IReportService reportService, [FromBody] ReportDto reportDto) => 
            {
                var context = new ValidationContext(reportDto);
                var results = new List<ValidationResult>();

                bool isValid = Validator.TryValidateObject(reportDto, context, results, true);

                if (!isValid || (reportDto.PostId == null && reportDto.CommentId == null))
                {
                    return Results.BadRequest(results);
                }

                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var report = await reportService.CreateAsync(reportDto, appUser.Id);

                return Results.Ok(report);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly); 
        }
    }
}