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
        public override async Task OnConnectedAsync() 
        {
            await base.OnConnectedAsync();
        }

        public async Task SendPrivateMessasge(ChatMessageDto messageDto)
        {
            var senderId = Context.UserIdentifier ?? "Anonym";

            await Clients.User(messageDto.ReceiverId)
                .ReceiveMessage(senderId, messageDto.Content);

            await Clients.Caller.ReceiveMessage(senderId, messageDto.Content);
        }
    }
}
