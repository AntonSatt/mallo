using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Application.Services;
using Gr8.Domain.Entities;
using Gr8.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Gr8.Api.Endpoints
{
    public static class CommunityEndpoints
    {
        public static void MapCommunityEndpoints(WebApplication app)
        {
            app.MapGet("/forum/posts", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IPostService postService) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var posts = await postService.GetAllPostsAsync(appUser.Id);

                if (posts.Count == 0)
                {
                    return Results.NoContent();
                }

                return Results.Ok(posts);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/forum/posts", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IPostService postService, [FromBody] CreatePostDto postDto) =>
            {
                var appUser = await userManager.GetUserAsync(user);
                if (appUser == null)
                {
                    return Results.Unauthorized();
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

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/posts/{PostId}/comments", async ([FromServices] ICommentService commentService, int postId) =>
            {
                var comments = await commentService.GetCommentsByPostAsync(postId);

                if (comments.Count != 0)
                {
                    return Results.Ok(comments);
                }

                return Results.NoContent();

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

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

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/categories", async ([FromServices] ICategoryService categoryService) =>
            {
                var categories = await categoryService.GetAllCategoriesAsync();
                if (categories.Count == 0)
                {
                    return Results.NoContent();
                }
                return Results.Ok(categories);

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

            app.MapPut("/forum/posts/{PostId}", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IPostService postService, [FromBody] UpdatePostDto updatePostDto, int postId) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var post = await postService.UpdatePostAsync(postId, updatePostDto, appUser.Id);

                if (post == null)
                {
                    return Results.BadRequest("Failed to update post.");
                }

                return Results.Ok(post);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPut("/forum/posts/{postId}/comments/{commentId}", async ([FromServices] ICommentService commentService, UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromBody] UpdateCommentDto editCommentDto, int commentId) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var comment = await commentService.GetCommentByIdAsync(commentId, appUser.Id);

                if (comment == null)
                {
                    return Results.NotFound("Comment not found.");
                }

                if (comment.AuthorInfo.Id != appUser.Id)
                {
                    return Results.Forbid();
                }

                comment.Id = commentId;
                comment.Content = editCommentDto.Content;

                var result = await commentService.UpdateCommentAsync(comment);

                if (result <= 0)
                {
                    return Results.BadRequest("Failed to update comment.");
                }

                return Results.Ok(comment);

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

                var comment = await commentService.GetCommentByIdAsync(commentId, appUser.Id);

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

            app.MapPost("/forum/posts/{postId}/hug", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IHugService hugService, int postId) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var hugged = await hugService.TogglePostHugAsync(postId, appUser.Id);

                return Results.Ok(new { hugged });

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/forum/comments/{commentId}/hug", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IHugService hugService, int commentId) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var hugged = await hugService.ToggleCommentHugAsync(commentId, appUser.Id);

                return Results.Ok(new { hugged });

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/posts/{postId}/hugs", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IHugService hugService, int postId) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var hugs = await hugService.GetAllPostHugsByUserIdAsync(appUser.Id, postId);

                return Results.Ok(hugs);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/comments/{commentId}/hugs", async (UserManager<ApplicationUser> userManager, ClaimsPrincipal user, [FromServices] IHugService hugService, int commentId) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var hugs = await hugService.GetAllCommentHugsByUserIdAsync(appUser.Id, commentId);

                return Results.Ok(hugs);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/forum/posts/{postId}/bookmark", async (UserManager<ApplicationUser> userManger, ClaimsPrincipal user, [FromServices] IBookmarkService bookService, int postId) =>
            {
                var appUser = await userManger.GetUserAsync(user);

                if(appUser == null) 
                {
                    return Results.Unauthorized();
                }

                var bookmarked = await bookService.TogglePostBookmarkAsync(postId, appUser.Id);

                return Results.Ok(new { bookmarked });

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/bookmarks", async (UserManager<ApplicationUser> userManger, ClaimsPrincipal user, [FromServices] IBookmarkService bookService) =>
            {
                var appUser = await userManger.GetUserAsync(user);

                if(appUser == null) 
                {
                    return Results.Unauthorized();
                }

                var savedBookmarks = await bookService.GetAllBookmarksByUserIdAsync(appUser.Id, 0);

                if(savedBookmarks.Count == 0) 
                {
                    return Results.NoContent();
                }

                return Results.Ok(savedBookmarks);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/forum/notifications", async (UserManager<ApplicationUser> userManger, ClaimsPrincipal user, [FromServices] INotificationService notificationService) =>
            {
                var appUser = await userManger.GetUserAsync(user);

                if(appUser == null) 
                {
                    return Results.Unauthorized();
                }

                var notifications = await notificationService.GetAllPostNotificationsByUserIdAsync(appUser.Id);
                
                if(notifications.Count == 0) 
                {
                    return Results.NoContent(); 
                }

                return Results.Ok(notifications);
            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPut("/forum/notifications/{notificationId}/seen", async (UserManager<ApplicationUser> userManger, ClaimsPrincipal user, [FromServices] INotificationService notificationService, int notificationId) =>
            {
                var appUser = await userManger.GetUserAsync(user);

                if (appUser == null)
                {
                    return Results.Unauthorized();
                }

                var marked = await notificationService.MarkPostNotificationAsSeenAsync(appUser.Id, notificationId);
                if (!marked)
                {
                    return Results.NotFound();
                }

                return Results.NoContent();
            }).RequireAuthorization(AuthorizationConstants.JwtOnly);
        }
    }
}