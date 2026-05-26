using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Gr8.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Security.Claims;

namespace Gr8.Api.Endpoints
{
    public static class ActivityEndpoints
    {
        public static void MapActivityEndpoints(WebApplication app)
        {
            app.MapGet("/map/activities", async ([FromServices] IActivityService activityService) =>
            {
                var activities = await activityService.GetAllActivitiesAsync();

                if (!activities.Any())
                {
                    return Results.NoContent();
                }

                return Results.Ok(activities);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/map/activities/{activityId}", async ([FromServices] IActivityService activityService, int activityId) =>
            {
                var response = await activityService.GetActivityByIdAsync(activityId);

                if (response != null)
                {
                    return Results.Ok(response);
                }
                else
                {
                    return Results.NotFound();
                }

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/map/activities", async (HttpRequest request, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IActivityService activityService) =>
            {
                var appUser = await userManager.GetUserAsync(user);
                if (appUser == null) return Results.Unauthorized();

                var form = await request.ReadFormAsync();

                byte[]? imageBytes = null;
                string? mimeType = null;

                if (form.Files["image"] is IFormFile file)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    imageBytes = ms.ToArray();
                    mimeType = form["imageMimeType"];
                }

                var createDto = new CreateActivityDto
                {
                    Title = form["title"]!,
                    Description = form["description"]!,
                    Url = form["url"],
                    Latitude = decimal.Parse(form["latitude"]!, CultureInfo.InvariantCulture),
                    Longitude = decimal.Parse(form["longitude"]!, CultureInfo.InvariantCulture),
                    Adress = form["adressName"],
                    StartAt = DateTimeOffset.Parse(form["startAt"]!, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind).UtcDateTime,
                    EndAt = DateTimeOffset.Parse(form["endAt"]!, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind).UtcDateTime,
                    Image = imageBytes,
                    ImageMimeType = mimeType
                };

                var context = new ValidationContext(createDto);
                var results = new List<ValidationResult>();
                bool isValid = Validator.TryValidateObject(createDto, context, results, true);
                if (!isValid) return Results.BadRequest(results);

                var response = await activityService.CreateActivityAsync(createDto, appUser.Id);
                return Results.Ok(response);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPut("/map/activities/{activityId}", async (int activityId, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IActivityService activityService, [FromBody] UpdateActivityDto updateDto) =>
            {
                var appUser = await userManager.GetUserAsync(user);
                if (appUser == null)
                { 
                    return Results.Unauthorized();
                }

                var context = new ValidationContext(updateDto);
                var results = new List<ValidationResult>();

                bool isValid = Validator.TryValidateObject(updateDto, context, results, true);

                if (!isValid)
                {
                    return Results.BadRequest(results);
                }

                try
                {
                    var response = await activityService.UpdateActivityAsync(activityId, updateDto, appUser.Id);

                    if (response == null)
                    {
                        return Results.NotFound();
                    }

                    return Results.Ok(response);
                }
                catch (UnauthorizedAccessException)
                {
                    return Results.Forbid();
                }

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapDelete("/map/activities/{activityId}", async (int activityId, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IActivityService activityService) =>
            {
                var appUser = await userManager.GetUserAsync(user);
                if (appUser == null) return Results.Unauthorized();

                try
                {
                    var success = await activityService.DeleteActivityAsync(activityId, appUser.Id);

                    if (!success)
                    {
                        return Results.NotFound();
                    }

                    return Results.Ok();
                }
                catch (UnauthorizedAccessException)
                {
                    return Results.Forbid();
                }

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/map/activities/bookmarks", async (ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IActivityBookmarkService activityBookmarkService) =>
            {
                var appUser = await userManager.GetUserAsync(user);
                if (appUser == null) return Results.Unauthorized();

                var bookmarks = await activityBookmarkService.GetAllActivityBookmarksByUserIdAsync(appUser.Id);
                return Results.Ok(bookmarks);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapPost("/map/activities/{activityId}/bookmark", async (int activityId, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IActivityBookmarkService activityBookmarkService) =>
            {
                var appUser = await userManager.GetUserAsync(user);
                if (appUser == null) return Results.Unauthorized();

                var isBookmarked = await activityBookmarkService.ToggleActivityBookmarkAsync(activityId, appUser.Id);
                return Results.Ok(new { isBookmarked });

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);        
        }
    }
}
