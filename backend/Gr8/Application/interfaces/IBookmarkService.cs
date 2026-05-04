using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IBookmarkService
    {
        Task<List<Bookmark?>> GetAllBookmarksAsync(string userId);
        Task<bool> TogglePostBookmarkAsync(int postId, string userId);
    }
}
