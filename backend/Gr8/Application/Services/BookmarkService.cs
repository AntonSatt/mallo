using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

// This file defines the BookmarkService class, which implements the IBookmarkService interface. The BookmarkService is
// responsible for managing bookmark-related operations in the application. It interacts with the ICommunityRepository to
// retrieve and update bookmark information in the database. The GetAllBookmarksByUserIdAsync method retrieves a list of
// bookmarks for a specific user and post, while the TogglePostBookmarkAsync method allows users to add or remove a bookmark
// for a specific post. If a bookmark already exists for the user and post, it will be removed and the method will return false.
// If no bookmark exists, a new bookmark will be created and saved to the database, and the method will return true.
// This functionality allows users to easily manage their bookmarks for posts in the application.

namespace Gr8.Application.Services
{
    public class BookmarkService : IBookmarkService
    {
        private readonly ICommunityRepository _communityRepository;
        public BookmarkService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public async Task<List<BookmarkDto>> GetAllBookmarksByUserIdAsync(string userId, int postId)
        {
            var bookmarks = await _communityRepository.GetAllBookmarksByUserIdAsync(userId, postId);

            return bookmarks.Select(b => new BookmarkDto
            {
                UserId = b.UserId,
                PostId = b.PostId

            }).ToList();
        }

        public async Task<bool> TogglePostBookmarkAsync(int postId, string userId)
        {
            var existingBookmark = await _communityRepository.GetPostBookmarkAsync(postId, userId);

            if(existingBookmark != null) 
            {
                _communityRepository.RemoveBookmark(existingBookmark);
                await _communityRepository.SaveChangesAsync();
                return false;
            }

            var bookmark = new Bookmark 
            {
                UserId = userId,
                PostId = postId
            };

            await _communityRepository.AddBookmarkAsync(bookmark);
            await _communityRepository.SaveChangesAsync(); 
            return true;
        }
    }
}
