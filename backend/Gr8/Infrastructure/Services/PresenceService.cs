
using Gr8.Application.Interfaces;

namespace Gr8.Infrastructure.Services
{
    public class PresenceService : IPresenceService
    {
        // Stores online users and their active SignalR connection IDs.
        private readonly Dictionary<string, HashSet<string>> _onlineUsers = new();

        // Prevents multiple threads from modifying the online users list at the same time.
        private readonly object _onlineUsersLock = new();

        public void UserConnected(string userId, string connectionId)
        {
            lock (_onlineUsersLock)
            {
                if (!_onlineUsers.ContainsKey(userId))
                {
                    _onlineUsers[userId] = new HashSet<string>();
                }

                _onlineUsers[userId].Add(connectionId);
            }
        }
        public bool UserDisconnected(string userId, string connectionId)
        {
            lock (_onlineUsersLock)
            {
                if (!_onlineUsers.ContainsKey(userId))
                {
                    return false;
                }

                _onlineUsers[userId].Remove(connectionId);

                if (_onlineUsers[userId].Any())
                {
                    return false;
                }

                _onlineUsers.Remove(userId);

                return true;
            }
        }

        public bool IsOnline(string userId)
        {
            lock (_onlineUsersLock)
            {
                return _onlineUsers.ContainsKey(userId);
            }
        }

        public List<string> GetOnlineUsers()
        {
            lock (_onlineUsersLock)
            {
                return _onlineUsers.Keys.ToList();
            }
        }
    }
}
