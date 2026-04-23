using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    public interface ICommentService
    {
        Task<CommentDto?> CreateAsync(CommentDto comment, int postId, string userId);
        Task<CommentDto?> GetCommentByIdAsync(int commentId);
        Task<int> UpdateCommentAsync(CommentDto comment);
        Task<bool> DeleteCommentAsync(int commentId, string userId);
        Task<List<CommentDto>?> GetCommentsByPostAsync(int postId);
    }
}