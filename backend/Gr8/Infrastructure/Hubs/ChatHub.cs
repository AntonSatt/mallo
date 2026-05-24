using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Gr8.Application.Common.Constants;

namespace Gr8.Infrastructure.Hubs
{
    [Authorize(Policy = AuthorizationConstants.JwtOnly)]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService) 
        {
            _chatService = chatService;
        }

        // Triggers automatic when a user connects to the signalR hub.
        public override async Task OnConnectedAsync() 
        {
            var userId = Context.UserIdentifier;

            if (!string.IsNullOrEmpty(userId)) 
            {
                await Clients.All.UserOnline(userId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception) 
        {
            var userId = Context.UserIdentifier;

            if(!string.IsNullOrEmpty(userId)) 
            {
                await Clients.All.UserOffline(userId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Sends a chat message and broadcasts it to the receiver in real time.
        public async Task SendMessage(SendChatMessageDto dto) 
        {
            var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(senderId)) 
            {
                throw new HubException("User is not authenticated.");
            }

            var message = await _chatService.SendMessageAsync(senderId, dto);

            await Clients.User(dto.ReceiverId).ReceiveMessage(message);

            await Clients.Caller.ReceiveMessage(message);
        }

        // Retrieves the full chat history between two users.
        public async Task<List<ChatMessageResponseDto>> GetChatHistory(string otherUserId) 
        {
            var currentUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId)) 
            {
                throw new HubException("User is not authenticated.");
            }

            return await _chatService.GetChatHistoryAsync(currentUserId, otherUserId);
        }

        // Retrieves all conversations for the current user.
        public async Task<List<ChatConversationDto>> GetConversations() 
        {
            var currentUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId)) 
            {
                throw new HubException("User is not authenticated.");
            }

            return await _chatService.GetUserConversationsAsync(currentUserId);
        }

        // Soft deletes a conversation for the current user.
        public async Task DeleteConversation(string otherUserId) 
        {
            var currentUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId)) 
            {
                throw new HubException("User is not authenticated.");
            }

            await _chatService.DeleteConversationForUserAsync(currentUserId, otherUserId);
        }

        // Notifies the receiver that the sender is typing a message in real time.
        public async Task Typing(string receiverId) 
        {
            var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(senderId))
            {
                throw new HubException("User is not authenticated.");
            }

            await Clients.User(receiverId).UserTyping(senderId);
        }

        // Marks all messages in a conversation as read for the current user.
        public async Task MarkConversationAsRead(string otherUserId)
        {
            var currentUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                throw new HubException("User is not authenticated.");
            }

            await _chatService.MarkMessagesAsReadAsync(currentUserId, otherUserId);
        }
    }
}
