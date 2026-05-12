using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IChatRepository
    {
        Task AddMessageAsync(ChatMessage message);
        Task<List<ChatMessage>> GetChatHistoryAsync(string user1, string user2);
        Task<int> SaveChangesAsync();
    }
}
