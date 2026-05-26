using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

namespace Gr8.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ICommunityRepository _communityRepository;
        private readonly IFirebasePushService _firebasePushService;
        private readonly IPresenceService _presenceService;
        public NotificationService(ICommunityRepository communityRepository, IFirebasePushService firebasePushService, IPresenceService presenceService)
        {
            _communityRepository = communityRepository;
            _firebasePushService = firebasePushService;
            _presenceService = presenceService;
        }

        public async Task AddNotificationAsync(int postId, string type, string userId)
        {
            var post = await _communityRepository.GetPostByIdAsync(postId);

            if (post.UserId == userId)
            {
                return;
            }

            var notification = new PostNotification
            {
                UserId = post.UserId,
                Type = type.ToString(),
                Title = post.Title,
                IsSeen = false,
                CreatedAt = DateTime.UtcNow
            };

            await _communityRepository.AddPostNotificationAsync(notification);

            await _communityRepository.SaveChangesAsync();

            // Send a Firebase push notification only if the receiver is currently offline.
            if (!_presenceService.IsOnline(post.UserId))
            {
                await _firebasePushService.SendToUserAsync(
                    post.UserId,
                    "Ny notis från Mallo",
                    notification.Title
                );
            }
        }

        public async Task<List<PostNotificationDto>> GetAllPostNotificationsByUserIdAsync(string userId)
        {
            var notifications = await _communityRepository.GetAllNotificationsByUserIdAsync(userId);

            return notifications.Select(n => new PostNotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Type = n.Type,
                IsSeen = n.IsSeen,
                CreatedAt = n.CreatedAt
            })
            .OrderByDescending(n => n.CreatedAt)
            .ToList();
        }

        public async Task<bool> MarkPostNotificationAsSeenAsync(string userId, int notificationId)
        {
            var notification = await _communityRepository.GetNotificationByIdAsync(notificationId);
            if (notification == null || notification.UserId != userId)
            {
                return false;
            }

            if (notification.IsSeen)
            {
                return true;
            }

            notification.IsSeen = true;
            await _communityRepository.SaveChangesAsync();

            return true;
        }

        public async Task SaveFirebaseTokenAsync(string userId, string token)
        {
            var firebaseToken = new UserFirebaseToken
            {
                UserId = userId,
                Token = token
            };

            await _communityRepository.SaveFirebaseTokenAsync(firebaseToken);
            await _communityRepository.SaveChangesAsync();
        }
    }
}
