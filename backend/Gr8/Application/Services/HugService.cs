using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using Gr8.Application.Common.Constants;

namespace Gr8.Application.Services
{
    public class HugService : IHugService
    {
        private readonly ICommunityRepository _communityRepository;
        private readonly INotificationService _notificationService;

        public HugService(ICommunityRepository communityRepository, INotificationService notificationService)
        {
            _communityRepository = communityRepository;
            _notificationService = notificationService;
        }
        public async Task<bool> TogglePostHugAsync(int postId, string userId)
        {
            var existingHug = await _communityRepository.GetPostHugAsync(postId, userId);

            if (existingHug != null)
            {
                _communityRepository.RemoveHug(existingHug);
                await _communityRepository.SaveChangesAsync();
                return false;
            }

            var hug = new Hug
            {
                UserId = userId,
                PostId = postId,
                CommentId = null
            };

            await _communityRepository.AddHugAsync(hug);
            await _communityRepository.SaveChangesAsync();
            await _notificationService.AddNotificationAsync(postId, NotificationTypes.PostHugged, hug.UserId);

            return true;
        }
        public async Task<bool> ToggleCommentHugAsync(int commentId, string userId)
        {
            var existingHug = await _communityRepository.GetCommentHugAsync(commentId, userId);

            if (existingHug != null)
            {
                _communityRepository.RemoveHug(existingHug);
                await _communityRepository.SaveChangesAsync();
                return false;
            }

            var hug = new Hug
            {
                UserId = userId,
                CommentId = commentId,
                PostId = null
            };

            await _communityRepository.AddHugAsync(hug);
            await _communityRepository.SaveChangesAsync();

            var comment = await _communityRepository.GetCommentByIdAsync(commentId);

            if (comment != null)
            {
                await _notificationService.AddNotificationAsync(comment.PostId, NotificationTypes.CommentHugged, userId);
            }
            return true;
        }
    }
}
