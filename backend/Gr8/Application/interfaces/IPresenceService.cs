// Contract used to track realtime online users through SignalR connections.
// Allows backend services to check if a user is online or offline.

namespace Gr8.Application.Interfaces
{
    public interface IPresenceService
    {
        void UserConnected(string userId, string connectionId);
        bool UserDisconnected(string userId, string connectionId);
        bool IsOnline(string userId);
        List<string> GetOnlineUsers();
    }
}
