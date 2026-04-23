using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IPostService
    {
        Task<PostDto?> CreateAsync(CreatePostDto post, string userId);
        Task<List<PostDto>> GetAllPostsAsync();
        Task<PostDto?> GetPostByIdAsync(int postId, string userId);
        Task<int> UpdatePostAsync(PostDto post);
        Task<bool> DeletePostAsync(int postId, string userId);
    }
}
