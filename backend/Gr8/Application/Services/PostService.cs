using Gr8.Application.DTOs;
using Gr8.Application.interfaces;
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

        public async Task<PostDto> CreateAsync(PostDto postDto, string userId)
        {
            var post = new Post(userId)
            {
                Content = postDto.Content
            };

            var result = await _communityRepository.AddAsync(post);

            if (result > 0)
            {
                return postDto;
            }
            return null; // Error handling?
        }
    }
}
