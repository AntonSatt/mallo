using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    public interface IChatService
    {
        //handles chat logic between the application and the database layer.
        Task<ChatMessageResponseDto> SendMessageAsync(string senderId, SendChatMessageDto dto);

        Task<List<ChatMessageResponseDto>> GetChatHistoryAsync(string currentUserId, string otherUserId);

        Task<List<ChatConversationDto>> GetUserConversationsAsync(string userId);

        Task DeleteConversationForUserAsync(string currentUserId, string otherUserId);
    }
}
