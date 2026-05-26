using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ICommunityRepository _communityRepository;
        public NotificationService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
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
        }

        public async Task<List<PostNotificationDto>> GetAllPostNotificationsByUserIdAsync(string userId)
        {
            var notifications = await _communityRepository.GetAllNotificationsByUserIdAsync(userId);

            var unseenNotifications = notifications.Where(n => !n.IsSeen).ToList();

            if (unseenNotifications.Any())
            {
                foreach (var notification in unseenNotifications)
                {
                    notification.IsSeen = true;
                }

                await _communityRepository.SaveChangesAsync();
            }

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
    }
}
