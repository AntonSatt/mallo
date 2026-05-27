using Gr8.Application.Common.Constants;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

// This file registers endpoints for the chat system in the API.
// Here are routes to retrieve the user's conversations,
// read the chat history with another user, and delete a conversation.
// The endpoints require JWT authentication and use IChatService
// to handle the chat logic.

namespace Gr8.Api.Endpoints
{
    public static class ChatEndpoints
    {
        public static void MapChatEndpoints(WebApplication app) 
        {
            app.MapGet("/chat/conversations", async (ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IChatService chatService) =>
            {
                var appUser = await userManager.GetUserAsync(user);

                if(appUser == null) 
                {
                    return Results.Unauthorized();
                }

                var conversations = await chatService.GetUserConversationsAsync(appUser.Id);

                if (!conversations.Any())
                {
                    return Results.NoContent();
                }

                return Results.Ok(conversations);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapGet("/chat/history/{otherUserId}", async (string otherUserId, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IChatService chatService) => 
            {
                var appUser = await userManager.GetUserAsync(user);

                if(appUser == null) 
                {
                    return Results.Unauthorized();
                }

                var messages = await chatService.GetChatHistoryAsync(appUser.Id, otherUserId);

                if (!messages.Any()) 
                {
                    return Results.NoContent();
                }

                return Results.Ok(messages);

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);

            app.MapDelete("/chat/conversations/{otherUserId}", async (string otherUserId, ClaimsPrincipal user, UserManager<ApplicationUser> userManager, [FromServices] IChatService chatService) => 
            {
                var appUser = await userManager.GetUserAsync(user);

                if(appUser == null) 
                {
                    return Results.Unauthorized();
                }

                await chatService.DeleteConversationForUserAsync(appUser.Id, otherUserId);

                return Results.Ok();

            }).RequireAuthorization(AuthorizationConstants.JwtOnly);
        }
    }
}
