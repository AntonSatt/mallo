using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Services
{
    public class BookmarkService : IBookmarkService
    {
        private readonly ICommunityRepository _communityRepository;
        public BookmarkService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public Task<List<Bookmark?>> GetAllBookmarksAsync(string userId)
        {
            throw new NotImplementedException();
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
