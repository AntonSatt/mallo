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

        // Stores online users and their active SignalR connection IDs in real time.
        private static readonly Dictionary<string, HashSet<string>> OnlineUsers = new();

        // Prevents multiple threads from modifying the online users list at the same time.
        private static readonly object OnlineUsersLock = new();

        public ChatHub(IChatService chatService) 
        {
            _chatService = chatService;
        }

        // Triggers automatic when a user connects to the signalR hub.
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                lock (OnlineUsersLock)
                {
                    if (!OnlineUsers.ContainsKey(userId))
                    {
                        OnlineUsers[userId] = new HashSet<string>();
                    }

                    OnlineUsers[userId].Add(Context.ConnectionId);
                }

                await Clients.Caller.OnlineUsers(OnlineUsers.Keys.ToList());
                await Clients.Others.UserOnline(userId);
            }

            await base.OnConnectedAsync();
        }

        // Triggers automatic when a user disconnects from the signalR hub.
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                var userWentOffline = false;

                lock (OnlineUsersLock)
                {
                    if (OnlineUsers.ContainsKey(userId))
                    {
                        OnlineUsers[userId].Remove(Context.ConnectionId);

                        if (!OnlineUsers[userId].Any())
                        {
                            OnlineUsers.Remove(userId);
                            userWentOffline = true;
                        }
                    }
                }

                if (userWentOffline)
                {
                    await Clients.Others.UserOffline(userId);
                }
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
