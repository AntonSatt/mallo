using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface ICommentService
    {
        Task<CommentDto?> CreateAsync(CommentDto comment, int postId, string userId);
        Task<CommentDto?> GetCommentByIdAsync(int commentId);
        Task<List<CommentDto>> GetCommentsByPostAsync(int postId);
        Task<int> UpdateCommentAsync(CommentDto comment);
    }
}