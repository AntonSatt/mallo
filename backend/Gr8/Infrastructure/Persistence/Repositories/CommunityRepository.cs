using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using Gr8.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace Gr8.Infrastructure.Persistence.Repositories
{
    public class CommunityRepository : ICommunityRepository
    {
        private readonly CommunityDbContext _communityDbContext;

        public CommunityRepository(CommunityDbContext communityDbContext)
        {
            _communityDbContext = communityDbContext;
        }

        // Added isDeleted filter to ensure only active posts and comments are retrieved on all Get operations and Delete operations
        // Not sure if this is the best way to handle soft deletes?
        public async Task<List<Post>> GetAllPostsAsync()
        {
            return await _communityDbContext.Posts
                .Where(p => !p.IsDeleted)
                .Include(p => p.Category)
                .Include(p => p.Tags)
                .Include(p => p.Comments.Where(c => !c.IsDeleted))
                .ToListAsync();
        }

        public async Task AddPostAsync(Post post)
        {
            await _communityDbContext.Posts.AddAsync(post);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _communityDbContext.SaveChangesAsync();
        }

        public async Task<List<Comment>> GetCommentsByPostAsync(int postId)
        {
            return await _communityDbContext.Comments
                .Where(c => c.PostId == postId)
                .Where(c => !c.IsDeleted)
                .ToListAsync();
        }

        public async Task AddCommentAsync(Comment comment)
        {
            await _communityDbContext.Comments.AddAsync(comment);
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _communityDbContext.Categories.ToListAsync();
        }

        public async Task<List<Tag>> GetAllTagsAsync()
        {
            return await _communityDbContext.Tags.ToListAsync();
        }

        public async Task<List<Tag>> GetTagsByIdAsync(List<int> tagIds)
        {
            return await _communityDbContext.Tags
                .Where(t => tagIds.Contains(t.Id))
                .ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int categoryId)
        {
            return await _communityDbContext.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
        }

        public async Task AddReportAsync(Report report)
        {
            await _communityDbContext.Reports.AddAsync(report);
        }

        public async Task<Comment?> GetCommentByIdAsync(int commentId)
        {
            return await _communityDbContext.Comments.FirstOrDefaultAsync(c => c.Id == commentId);
        }

        public async Task UpdateCommentAsync(Comment comment)
        {
            _communityDbContext.Comments.Update(comment);
            await Task.CompletedTask;
        }

        public async Task UpdatePostAsync(Post post)
        {
            _communityDbContext.Posts.Update(post);
            await Task.CompletedTask;
        }

        public async Task<Post?> GetPostByIdAsync(int postId)
        {
            return await _communityDbContext.Posts
                .Include(p => p.Category)
                .Include(p => p.Tags)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<Hug?> GetPostHugAsync(int postId, string userId)
        {
            return await _communityDbContext.Hugs.FirstOrDefaultAsync(h => h.PostId == postId && h.UserId == userId);
        }

        public async Task<Hug?> GetCommentHugAsync(int commentId, string userId)
        {
            return await _communityDbContext.Hugs.FirstOrDefaultAsync(h => h.CommentId == commentId && h.UserId == userId);
        }

        public async Task AddHugAsync(Hug hug)
        {
            await _communityDbContext.Hugs.AddAsync(hug);
        }

        public async Task<List<Hug>> GetAllPostHugsByUserIdAsync(string userId, int postId)
        {
            return await _communityDbContext.Hugs
                .Where(h => h.UserId == userId && h.PostId == postId)
                .ToListAsync();
        }

        public async Task<List<Hug>> GetAllCommentHugsByUserIdAsync(string userId, int commentId)
        {
            return await _communityDbContext.Hugs
                .Where(h => h.UserId == userId && h.CommentId == commentId)
                .ToListAsync();
        }

        public void RemoveHug(Hug hug)
        {
            _communityDbContext.Hugs.Remove(hug);
        }

        public async Task<Bookmark?> GetPostBookmarkAsync(int postId, string userId) 
        {
            return await _communityDbContext.Bookmarks.FirstOrDefaultAsync(b => b.PostId == postId && b.UserId == userId);
        }

        public async Task<List<Bookmark>> GetAllBookmarksByUserIdAsync(string userId, int postId)
        {
            return await _communityDbContext.Bookmarks
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public async Task AddBookmarkAsync(Bookmark bookmark)
        {
            await _communityDbContext.Bookmarks.AddAsync(bookmark);
        }

        public void RemoveBookmark(Bookmark bookmark) 
        {
            _communityDbContext.Bookmarks.Remove(bookmark);
        }

        public Task<int> CountCommentsByPostIdAsync(int postId)
        {
            return _communityDbContext.Comments
                .Where(c => c.PostId == postId)
                .Where(c => !c.IsDeleted)
                .CountAsync();
        }

        public async Task<List<int>> GetUserTagIdsAsync(string userId)
        {
            return await _communityDbContext.Set<ApplicationUser>()
                .Where(u => u.Id == userId)
                .SelectMany(u => u.Tags.Select(t => t.Id))
                .OrderBy(id => id)
                .ToListAsync();
        }

        public async Task<List<int>> GetExistingTagIdsAsync(List<int> tagIds)
        {
            if (tagIds.Count == 0)
            {
                return new List<int>();
            }

            return await _communityDbContext.Tags
                .Where(t => tagIds.Contains(t.Id))
                .Select(t => t.Id)
                .ToListAsync();
        }

        public async Task ReplaceUserTagIdsAsync(string userId, List<int> tagIds)
        {
            var user = await _communityDbContext.Set<ApplicationUser>()
                .Include(u => u.Tags)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return;
            }

            user.Tags.Clear();

            if (tagIds.Count > 0)
            {
                var tags = await _communityDbContext.Tags
                    .Where(t => tagIds.Contains(t.Id))
                    .ToListAsync();

                foreach (var tag in tags)
                {
                    user.Tags.Add(tag);
                }
            }

            await _communityDbContext.SaveChangesAsync();
        }

        public async Task<List<Activity>> GetAllActivitiesAsync()
        {
            return await _communityDbContext.Activities
                .Where(a => !a.IsDeleted)
                .ToListAsync();
        }

        public async Task<Activity?> GetActivityByIdAsync(int id)
        {
            return await _communityDbContext.Activities
                .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);
        }

        public async Task AddActivityAsync(Activity activity)
        {
            await _communityDbContext.Activities.AddAsync(activity);
        }

        public async Task UpdateActivityAsync(Activity activity)
        {
            _communityDbContext.Activities.Update(activity);
            await Task.CompletedTask;
        }

        public async Task DeleteActivityAsync(Activity activity)
        {
            activity.IsDeleted = true;
            _communityDbContext.Activities.Update(activity);
            await Task.CompletedTask;
        }

        public Task<ActivityBookmark?> GetActivityBookmarkAsync(int activityId, string userId)
        {
            return _communityDbContext.ActivityBookmarks
                .FirstOrDefaultAsync(ab => ab.ActivityId == activityId && ab.UserId == userId);
        }

        public void RemoveActivityBookmark(ActivityBookmark bookmark)
        {
            _communityDbContext.ActivityBookmarks.Remove(bookmark);
        }

        public async Task AddActivityBookmarkAsync(ActivityBookmark bookmark)
        {
            await _communityDbContext.ActivityBookmarks.AddAsync(bookmark);
        }

        public Task<List<ActivityBookmark>> GetAllActivityBookmarksByUserIdAsync(string userId)
        {
            return _communityDbContext.ActivityBookmarks
                .Where(ab => ab.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<ActivityCalender>> GetUserCalendarActivitiesAsync(string userId)
        {
            return await _communityDbContext.ActivityCalenders
                .Where(ac => ac.UserId == userId)
                .Include(ac => ac.Activity)
                .ToListAsync();
        }

        public async Task AddUserCalendarActivityAsync(ActivityCalender entry)
        {
            await _communityDbContext.ActivityCalenders.AddAsync(entry);
        }

        public Task RemoveUserCalendarActivityAsync(ActivityCalender entry)
        {
            _communityDbContext.ActivityCalenders.Remove(entry);
            return Task.CompletedTask;
        }

        public async Task<ActivityCalender?> GetUserCalendarActivityAsync(string userId, int activityId)
        {
            return await _communityDbContext.ActivityCalenders
                .FirstOrDefaultAsync(ac => ac.UserId == userId && ac.ActivityId == activityId);
        }

        public async Task<List<PostNotification>> GetAllNotificationsByUserIdAsync(string userId)
        {
            return await _communityDbContext.PostNotifications.Where(pn => pn.UserId == userId).ToListAsync();
        }

        public async Task<PostNotification?> GetNotificationByIdAsync(int notificationId)
        {
            return await _communityDbContext.PostNotifications.FirstOrDefaultAsync(pn => pn.Id == notificationId);
        }

        public async Task AddPostNotificationAsync(PostNotification notification)
        {
            await _communityDbContext.PostNotifications.AddAsync(notification);
        }

        public void RemovePostNotifications(PostNotification notification)
        {
             _communityDbContext.PostNotifications.Remove(notification);
        }
        public async Task<int> GetActivityCalendarCountAsync(int activityId)
        {
            return await _communityDbContext.ActivityCalenders
                .Where(ac => ac.ActivityId == activityId)
                .CountAsync();
        }

        public async Task AddFirebaseTokenAsync(UserFirebaseToken firebaseToken)
        {
            await _communityDbContext.UserFirebaseTokens.AddAsync(firebaseToken);
        }

        public async Task<List<UserFirebaseToken>> GetFirebaseTokensByUserIdAsync(string userId)
        {
            return await _communityDbContext.UserFirebaseTokens
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public async Task<UserFirebaseToken?> GetFirebaseTokenAsync(string token)
        {
            return await _communityDbContext.UserFirebaseTokens
                .FirstOrDefaultAsync(t => t.Token == token);
        }

        public async Task RemoveFirebaseTokenAsync(UserFirebaseToken token)
        {
            _communityDbContext.UserFirebaseTokens.Remove(token);

            await Task.CompletedTask;
        }
    }
}