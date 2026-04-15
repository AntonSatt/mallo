using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Services
{
    public class PostService : IPostService
    {
        private readonly ICommunityRepository _communityRepository;

        public PostService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public async Task<PostDto?> CreateAsync(PostDto postDto, string userId) //Add categoryId and tags
        {
            var post = new Post(userId, 0, new List<Tag>())
            {
                Content = postDto.Content
            };

            await _communityRepository.AddPostAsync(post);
            var result = await _communityRepository.SaveChangesAsync();

            if (result > 0)
            {
                return postDto;
            }

            return null;
        }

        public async Task<List<PostDto>> GetAllPostsAsync()
        {
            var posts = await _communityRepository.GetAllPostsAsync();

            return posts.Select(p => new PostDto 
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                IsDeleted = p.IsDeleted,
                IsEdited = p.IsEdited
            })
            .ToList();
        }
    }
}
