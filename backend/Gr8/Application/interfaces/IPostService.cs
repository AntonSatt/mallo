using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IPostService
    {
        Task<PostDto?> CreateAsync(CreatePostDto post, string userId);
        Task<List<PostDto>> GetAllPostsAsync(string userId);
        Task<PostDto?> GetPostByIdAsync(int postId, string userId);
        Task<PostDto?> UpdatePostAsync(int postId, UpdatePostDto updatePostDto, string userId);
        Task<bool> DeletePostAsync(int postId, string userId);
    }
}
