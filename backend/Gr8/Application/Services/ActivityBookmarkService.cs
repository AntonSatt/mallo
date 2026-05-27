using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

// This file defines the ActivityBookmarkService class, which implements the IActivityBookmarkService interface.
// The ActivityBookmarkService is responsible for managing activity bookmark-related operations in the application.
// It interacts with the ICommunityRepository to retrieve, add, and remove activity bookmarks from the database.
// The GetAllActivityBookmarksByUserId method retrieves all activity bookmarks for a specific user, while the
// ToggleActivityBookmarkAsync method toggles the bookmark status for a given activity and user, adding a bookmark if it
// doesn't exist or removing it if it does. The service ensures that changes are saved to the database and returns
// appropriate results based on the operations performed. 

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
            var result = await _communityRepository.SaveChangesAsync();
            return result > 0;        
        }
    }
}
