using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Gr8.Infrastructure.Hubs
{
    //[Authorize] - Comment out for local testing
    // When it is activated, a valid JWT-token is required to even open a connection to the HUB.
    public class ChatHub : Hub<IChatClient>
    {
        /// <summary>
        /// Runs automatically every time a new user (client) connects to the hub.
        /// </summary>
        public override async Task OnConnectedAsync() 
        {
            // Context.UserIdentifier is retrieved from the user's JWT token (sub or nameid).
            var userId = Context.UserIdentifier;
            // If the user is logged in (has an ID), we add their specific connection to a "Group".
            // This is important to be able to send messages to a specific person (Private Message)
            // instead of always sending to "All".
            if (!string.IsNullOrEmpty(userId)) 
            {
                // In a Kubernetes/Redis environment, SignalR ensures that this group mapping is shared between all of your pods.
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }

            // The base method is executed to complete the default connection logic.
            await base.OnConnectedAsync();
        }

        /// <summary>
        /// This method is called from your React frontend via connection.invoke("SendMessage", ...).
        /// </summary>
        /// <param name="messageDto">Our "container" that holds the message text and validation rules.</param>
        public async Task SendMessage(ChatMessageDto messageDto)
        {
            // 1. Context.UserIdentifier is the "Sender" (securely retrieved from the server, not from the client).
            // 2. messageDto.Content is the text itself (validated via [Required] and [MaxLength] in the DTO class).

            // Clients.All does a "Broadcast" - sends the message to EVERYONE who is currently connected.
            // .ReceiveMessage is the method we defined in our Interface (IChatClient).
            await Clients.All.ReceiveMessage(Context.UserIdentifier, messageDto.Content);
        }
    }
}
