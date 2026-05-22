using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Services
{
    public class ActivityBookmarkService : IActivityBookmarkService
    {
        private readonly ICommunityRepository _communityRepository;

        public ActivityBookmarkService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public async Task<List<ActivityBookmarkDto?>> GetAllActivityBookmarksByUserIdAsync(string userId)
        {
            var bookmarks = await _communityRepository.GetAllActivityBookmarksByUserIdAsync(userId);
            return bookmarks.Select(b => (ActivityBookmarkDto?)new ActivityBookmarkDto
            {
                UserId = b.UserId,
                ActivityId = b.ActivityId
            }).ToList();
        }

        public async Task<bool> ToggleActivityBookmarkAsync(int activityId, string userId)
        {
            var existingBookmark = await _communityRepository.GetActivityBookmarkAsync(activityId, userId);

            if (existingBookmark != null)
            {
                _communityRepository.RemoveActivityBookmark(existingBookmark);
                await _communityRepository.SaveChangesAsync();
                return false;
            }

            var bookmark = new ActivityBookmark
            {
                UserId = userId,
                ActivityId = activityId
            };

            await _communityRepository.AddActivityBookmarkAsync(bookmark);
            await _communityRepository.SaveChangesAsync();
            return true;        
        }
    }
}
