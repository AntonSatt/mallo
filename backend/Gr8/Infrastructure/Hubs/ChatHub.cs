using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Gr8.Infrastructure.Hubs
{
    [Authorize] 
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService) 
        {
            _chatService = chatService;
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
    }
}
