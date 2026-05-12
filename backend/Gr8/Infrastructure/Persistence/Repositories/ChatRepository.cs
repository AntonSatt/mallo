using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Gr8.Infrastructure.Persistence.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly CommunityDbContext _communityDbContext;

        public ChatRepository(CommunityDbContext communityDbContext) 
        {
            _communityDbContext = communityDbContext;
        }

        // Adds a new chat message to the database context.
        public async Task AddMessageAsync(ChatMessage message) 
        {
            await _communityDbContext.ChatMessages.AddAsync(message);
        }

        // Retrieves the chat history between two users while excluding messages hidden by either user.
        public async Task<List<ChatMessage>> GetChatHistoryAsync(string currentUserId, string otherUserId) 
        {
            return await _communityDbContext.ChatMessages.Where(m =>
                (m.SenderId == currentUserId && m.ReceiverId == otherUserId && !m.DeletedBySender) ||

                (m.SenderId == otherUserId && m.ReceiverId == currentUserId && !m.DeletedByReceiver)) 
                .OrderBy(m => m.SendAt)
                .ToListAsync();
        }

        // Retrieves all visible chat messages for a specific user.
        public async Task<List<ChatMessage>> GetUserConversationsAsync(string userId) 
        {
            return await _communityDbContext.ChatMessages.Where(m => (m.SenderId == userId && !m.DeletedBySender) ||
            (m.ReceiverId == userId && !m.DeletedByReceiver)).OrderByDescending(m => m.SendAt).ToListAsync();
        }

        // Retrieves a specific chat message by its ID. It returns null if the message is not found.
        public async Task<ChatMessage?> GetMessageByIdAsync(int messageId) 
        {
            return await _communityDbContext.ChatMessages.FirstOrDefaultAsync(m => m.Id == messageId);
        }

        public async Task SaveChangesAsync() 
        {
            await _communityDbContext.SaveChangesAsync();
        }
    }
}
