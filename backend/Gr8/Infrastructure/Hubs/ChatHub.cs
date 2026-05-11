using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Persistence;
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
        private readonly CommunityDbContext _context;
        public ChatHub(CommunityDbContext context) 
        {
            _context = context;
        }

        // This method is called when a client connects to the hub.
        public override async Task OnConnectedAsync() 
        {
            await base.OnConnectedAsync(); //Send the message to the right client in real time.
        }

        public async Task SendPrivateMessage(ChatMessageDto messageDto)
        {
            //Finding out who is sending the message.
            var senderId = Context.UserIdentifier ?? "Anonym";

            //Send the message to the receiver.
            await Clients.User(messageDto.ReceiverId)
                .ReceiveMessage(senderId, messageDto.Content);

            //Show the message to the sender.
            await Clients.Caller.ReceiveMessage(senderId, messageDto.Content);
        }
    }
}
