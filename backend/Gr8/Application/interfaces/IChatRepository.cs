using Gr8.Domain.Entities;

namespace Gr8.Application.Interfaces
{
    public interface IChatRepository
    {
        //defines the database operations required for chat functionality.
        Task AddMessageAsync(ChatMessage message);
        Task<List<ChatMessage>> GetChatHistoryAsync(string currentUserId, string otherUserId);
        Task<List<ChatMessage>> GetUserConversationsAsync(string userId);
        Task<ChatMessage?> GetMessageByIdAsync(int messageId);
        Task SaveChangesAsync();
    }
}
