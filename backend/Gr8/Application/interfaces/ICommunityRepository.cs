using Gr8.Domain.Entities;

namespace Gr8.Application.Interfaces
{
    public interface ICommunityRepository
    {
        Task AddPostAsync(Post post);
        Task<int> SaveChangesAsync();
        Task<List<Comment>> GetCommentsByPostAsync(int postId);
        Task AddCommentAsync(Comment comment);
        Task<List<Post>> GetAllPostsAsync();
        Task<List<Category>> GetAllCategoriesAsync();
        Task<List<Tag>> GetAllTagsAsync();
        Task<List<Tag>> GetTagsByIdAsync(List<int> tagIds);
        Task<Category?> GetCategoryByIdAsync(int categoryId);
        Task AddReportAsync(Report report);
        Task<Post?> DeletePostAsync(int postId);
        Task<Post?> GetPostByIdAsync(int postId);
        Task<Comment?> DeleteCommentAsync(int commentId);
        Task<Comment?> GetCommentByIdAsync(int commentId);
    }
}