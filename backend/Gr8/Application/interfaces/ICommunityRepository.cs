using Gr8.Application.DTOs;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface ICommunityRepository
    {
        Task AddPostAsync(Post post);
        Task<int> SaveChangesAsync();
        Task<List<Comment>> GetCommentsByPostAsync(int postId);
        Task AddCommentAsync(Comment comment);
        Task <List<Post>> GetAllPostsAsync();
    }
}