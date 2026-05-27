using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    //handles chat logic between the application and the database layer.
    public interface IChatService
    {
        Task<ChatMessageResponseDto> SendMessageAsync(string senderId, SendChatMessageDto dto);
        Task<List<ChatMessageResponseDto>> GetChatHistoryAsync(string currentUserId, string otherUserId);
        Task<List<ChatConversationDto>> GetUserConversationsAsync(string userId);
        Task MarkMessagesAsReadAsync(string currentUserId, string otherUserId);
        Task DeleteConversationForUserAsync(string currentUserId, string otherUserId);
    }
}
