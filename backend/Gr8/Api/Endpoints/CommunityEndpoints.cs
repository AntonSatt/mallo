using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Gr8.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

            app.MapPost("/forum/posts", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IPostService postService, [FromBody] CreatePostDto postDto) =>
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

            app.MapGet("/forum/posts/{PostId}/comments", async ([FromServices] ICommentService commentService, int postId) =>
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

            app.MapGet("/forum/tags", async ([FromServices] ITagService tagService) =>
            {
                var tags = await tagService.GetAllTagsAsync();
                if (tags.Count == 0)
                {
                    return Results.NoContent();
                }
                return Results.Ok(tags);
            })
             .RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/categories", async ([FromServices] ICategoryService categoryService) =>
            {
                var categories = await categoryService.GetAllCategoriesAsync();
                if (categories.Count == 0)
                {
                    return Results.NoContent();
                }
                return Results.Ok(categories);
             })
             .RequireAuthorization(AuthorizationConstants.JwtOnly);

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

            app.MapDelete("/forum/posts/{PostId}", async (int postId, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IPostService postService) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null) 
                {
                    return Results.Unauthorized();
                }

                var result = await postService.DeletePostAsync(postId, appUser.Id);

                if (!result)
                {
                    return Results.NotFound();
                }

                return Results.Ok();

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapDelete("/forum/comments/{CommentId}", async (int commentId, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] ICommentService commentService) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var comment = await commentService.GetCommentByIdAsync(commentId);

                if (comment == null)
                {
                    return Results.NotFound();
                }

                var result = await commentService.DeleteCommentAsync(commentId, appUser.Id);

                if (!result)
                {
                    return Results.NotFound();
                }
                return Results.Ok();

             }).RequireAuthorization(AuthorizationConstants.JwtOnly);
        }
    }
}