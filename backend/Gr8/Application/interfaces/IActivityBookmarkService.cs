using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IActivityBookmarkService
    {
        Task<List<ActivityBookmarkDto?>> GetAllActivityBookmarksByUserIdAsync(string userId);
        Task<bool> ToggleActivityBookmarkAsync(int activityId, string userId);
    }
}
