using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    public interface IActivityBookmarkService
    {
        Task<List<ActivityBookmarkDto?>> GetAllActivityBookmarksByUserIdAsync(string userId);
        Task<bool> ToggleActivityBookmarkAsync(int activityId, string userId);
    }
}
