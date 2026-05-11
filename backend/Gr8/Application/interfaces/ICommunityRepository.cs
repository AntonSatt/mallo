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
        Task<Comment?> GetCommentByIdAsync(int commentId);
        Task UpdateCommentAsync(Comment oldComment);
        Task UpdatePostAsync(Post oldPost);
        Task<Post> GetPostByIdAsync(int id);
        Task<Hug?> GetPostHugAsync(int postId, string UserId);
        Task<Hug?> GetCommentHugAsync(int commentId, string UserId);
        Task AddHugAsync(Hug hug);
        void RemoveHug(Hug hug);
        Task<List<Activity>> GetAllActivitiesAsync();
        Task<Activity?> GetActivityByIdAsync(int id);
        Task AddActivityAsync(Activity activity);
        Task UpdateActivityAsync(Activity activity);
        Task DeleteActivityAsync(Activity activity);
    }
}