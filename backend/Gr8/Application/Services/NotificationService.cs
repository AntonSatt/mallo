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
                var pushTitle = "Mallo";
                var pushBody = type switch
                {
                    "Comment" => $"Någon kommenterade ditt inlägg: {post.Title}",
                    "Hug" => $"Du har fått en kram: {post.Title}",
                    _ => $"Du har en ny notis: {post.Title}"
                };

                // Send a Firebase push notification only if the receiver is currently offline.
                if (!_presenceService.IsOnline(post.UserId))
                {
                    await _firebasePushService.SendToUserAsync(
                        post.UserId,
                        pushTitle,
                        pushBody
                    );
                }
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

        // Prevents duplicate Firebase tokens by reusing the existing device token
        // and updating it to the latest logged in user.
        public async Task SaveFirebaseTokenAsync(string userId, string token)
        {
            var existingToken = await _communityRepository.GetFirebaseTokenAsync(token);

            if (existingToken != null)
            {
                existingToken.UserId = userId;
                existingToken.CreatedAt = DateTime.UtcNow;

                await _communityRepository.SaveChangesAsync();
                return;
            }

            var firebaseToken = new UserFirebaseToken
            {
                UserId = userId,
                Token = token,
                CreatedAt = DateTime.UtcNow
            };

            await _communityRepository.AddFirebaseTokenAsync(firebaseToken);
            await _communityRepository.SaveChangesAsync();
        }

        public async Task AddActivityNotificationAsync(int activityId, string userId)
        {
            var activity = await _communityRepository.GetActivityByIdAsync(activityId);

            if (activity == null) return;

            var notification = new PostNotification
            {
                UserId = userId,
                Type = NotificationTypes.ActivityAttended,
                Title = activity.Title,
                IsSeen = false,
                CreatedAt = activity.StartAt
            };

            await _communityRepository.AddPostNotificationAsync(notification);
            await _communityRepository.SaveChangesAsync();
        }
    }
}
