using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface INotificationService
    {
        Task AddNotificationAsync(int postId, string type, string userId);
        Task<List<PostNotificationDto>> GetAllPostNotificationsByUserIdAsync(string userId);
        Task<bool> MarkPostNotificationAsSeenAsync(string userId, int notificationId);
        Task SaveFirebaseTokenAsync(string userId, string token);
        Task AddActivityNotificationAsync(int activityId, string userId);
    }
}
