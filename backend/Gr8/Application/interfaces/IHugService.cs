using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IHugService
    {
        Task<bool> TogglePostHugAsync(int postId, string UserId);
        Task<bool> ToggleCommentHugAsync(int commentId, string UserId);
        Task<List<HugDto?>> GetAllPostHugsByUserIdAsync(string userId, int postId);
        Task<List<HugDto?>> GetAllCommentHugsByUserIdAsync(string userId, int commentId);
    }
}
