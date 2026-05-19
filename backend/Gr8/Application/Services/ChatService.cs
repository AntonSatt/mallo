using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

namespace Gr8.Application.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IApplicationRepository _applicationRepository;

        public ChatService(IChatRepository chatRepository, IApplicationRepository applicationRepository)
        {
            _chatRepository = chatRepository;
            _applicationRepository = applicationRepository;
        }

        // Creates and saves a new chat message, then returns it as a response DTO.
        public async Task<ChatMessageResponseDto> SendMessageAsync(string senderId, SendChatMessageDto dto) 
        {
            var message = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                ActivityId = dto.ActivityId,
                Content = dto.Content,
                SendAt = DateTime.UtcNow
            };

            await _chatRepository.AddMessageAsync(message);
            await _chatRepository.SaveChangesAsync();

            return new ChatMessageResponseDto 
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                ActivityId = message.ActivityId,
                Content = message.Content,
                SendAt = message.SendAt,
                IsRead = message.IsRead
            };
        }

        // Retrieves the full chat history between two users and maps the messages to response DTOs.
        public async Task<List<ChatMessageResponseDto>> GetChatHistoryAsync(string currentUserId, string otherUserId) 
        {
            var messages = await _chatRepository.GetChatHistoryAsync(currentUserId, otherUserId);

            return messages.Select(m => new ChatMessageResponseDto 
            {
                Id = m.Id,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                ActivityId = m.ActivityId,
                Content = m.Content,
                SendAt = m.SendAt,
                IsRead = m.IsRead
            }).ToList();
        }

        // Retrieves and groups all conversations for a user, including the latest message and unread status.
        public async Task<List<ChatConversationDto>> GetUserConversationsAsync(string userId) 
        {
            var messages = await _chatRepository.GetUserConversationsAsync(userId);

            var conversations = new List<ChatConversationDto>();

            foreach (var group in messages.GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId))
            {
                var latestMessage = group.OrderByDescending(m => m.SendAt).First();

                //var otherUserId = group.Key;
                var otherUserId = latestMessage.SenderId == userId ? latestMessage.ReceiverId : latestMessage.SenderId;

                var avatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(otherUserId);
                var fullName = await _applicationRepository.GetFullNameByIdAsync(otherUserId);
                var userName = await _applicationRepository.GetUserNameByIdAsync(otherUserId);

                conversations.Add(new ChatConversationDto
                {
                    OtherUserId = otherUserId,
                    OtherUserFullName = fullName ?? "Okänd användare",
                    OtherUserName = userName ?? "Okänd användare",
                    ActivityId = latestMessage.ActivityId,
                    LastMessage = latestMessage.Content,
                    LastMessageAt = latestMessage.SendAt,
                    HasUnreadMessage = group.Any(m => m.ReceiverId == userId && !m.IsRead),
                    AvatarId = avatarId
                });
            }

            var sortedConversations = conversations
                .OrderByDescending(c => c.LastMessageAt)
                .ToList();

            return sortedConversations;
        }

        // Soft deletes a conversation for the current user without removing messages from the database.
        public async Task DeleteConversationForUserAsync(string currentUserId, string otherUserId) 
        {
            var messages = await _chatRepository.GetChatHistoryAsync(currentUserId, otherUserId);

            foreach(var message in messages) 
            {
                if(message.SenderId == currentUserId) 
                {
                    message.DeletedBySender = true;
                }
                if(message.ReceiverId == currentUserId) 
                {
                    message.DeletedByReceiver = true;
                }
            }

            await _chatRepository.SaveChangesAsync();
        }
    }
}
