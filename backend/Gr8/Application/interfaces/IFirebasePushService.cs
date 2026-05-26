
//A contract that NotificationService can use without needing to know how Firebase works.

namespace Gr8.Application.Interfaces
{
    public interface IFirebasePushService
    {
        Task SendToUserAsync(string userId, string title, string body);
    }
}
