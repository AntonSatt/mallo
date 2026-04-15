using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Infrastructure.Persistence.Repositories
{
    public class CommunityRepository : ICommunityRepository
    {
        private readonly CommunityDbContext _communityDbContext;

        public CommunityRepository(CommunityDbContext communityDbContext)
        {
            _communityDbContext = communityDbContext;
        }

        public async Task<List<Post>> GetAllPostsAsync()
        {
            return await _communityDbContext.Posts
                .Include(p => p.Category)
                .Include(p => p.Tags)
                .Include(p => p.Comments)
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
            return await _communityDbContext.Comments.Where(c => c.PostId == postId).ToListAsync();
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
    }
}