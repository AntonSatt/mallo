using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    public interface IBookmarkService
    {
        Task<List<BookmarkDto?>> GetAllBookmarksByUserIdAsync(string userId, int postId);
        Task<bool> TogglePostBookmarkAsync(int postId, string userId);
    }
}
