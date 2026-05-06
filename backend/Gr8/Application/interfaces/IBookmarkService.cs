using Gr8.Application.DTOs;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IBookmarkService
    {
        Task<List<BookmarkDto?>> GetAllBookmarksByUserIdAsync(string userId, int postId);
        Task<bool> TogglePostBookmarkAsync(int postId, string userId);
    }
}
