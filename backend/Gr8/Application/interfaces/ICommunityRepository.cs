using Gr8.Application.DTOs;
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
        Task<List<Hug>> GetAllPostHugsByUserIdAsync(string userId, int postId);
        Task<List<Hug>> GetAllCommentHugsByUserIdAsync(string userId, int commentId);
        Task<Hug?> GetCommentHugAsync(int commentId, string UserId);
        Task AddHugAsync(Hug hug);
        void RemoveHug(Hug hug);
        Task<List<Bookmark?>> GetAllBookmarksByUserIdAsync(string userId, int postId);
        Task<Bookmark?> GetPostBookmarkAsync(int postId, string userId);
        Task AddBookmarkAsync(Bookmark bookmark);
        void RemoveBookmark(Bookmark bookmark);
        Task<int> CountCommentsByPostIdAsync(int postId);
        Task<List<int>> GetUserTagIdsAsync(string userId);
        Task<List<int>> GetExistingTagIdsAsync(List<int> tagIds);
        Task ReplaceUserTagIdsAsync(string userId, List<int> tagIds);
        Task<List<Activity>> GetAllActivitiesAsync();
        Task<Activity?> GetActivityByIdAsync(int id);
        Task AddActivityAsync(Activity activity);
        Task UpdateActivityAsync(Activity activity);
        Task DeleteActivityAsync(Activity activity);
        Task<ActivityBookmark?> GetActivityBookmarkAsync(int activityId, string userId);
        void RemoveActivityBookmark(ActivityBookmark bookmark);
        Task AddActivityBookmarkAsync(ActivityBookmark bookmark);
        Task<List<ActivityBookmark>> GetAllActivityBookmarksByUserIdAsync(string userId);
        Task<List<ActivityCalender>> GetUserCalendarActivitiesAsync(string userId);
        Task AddUserCalendarActivityAsync(ActivityCalender entry);
        Task RemoveUserCalendarActivityAsync(ActivityCalender entry);
        Task<ActivityCalender?> GetUserCalendarActivityAsync(string userId, int activityId);
        Task<List<PostNotification>> GetAllNotificationsByUserIdAsync(string userId);
        Task<PostNotification?> GetNotificationByIdAsync(int notificationId);
        Task AddPostNotificationAsync(PostNotification notification);
        void RemovePostNotifications(PostNotification notification);
        Task<int> GetActivityCalendarCountAsync(int activityId);
        Task AddFirebaseTokenAsync(UserFirebaseToken firebaseToken);
        Task<List<UserFirebaseToken>> GetFirebaseTokensByUserIdAsync(string userId);
        Task<UserFirebaseToken?> GetFirebaseTokenAsync(string token);
        Task RemoveFirebaseTokenAsync(UserFirebaseToken token);
    }
}