using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace Gr8.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommunityRepository _communityRepository;
        public CommentService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public async Task<List<CommentDto>> GetCommentsByPostAsync(int postId)
        {
            var comments = await _communityRepository.GetCommentsByPostAsync(postId);

            return comments
                .Select(c => new CommentDto
                {
                    Content = c.Content,
                    IsDeleted = c.IsDeleted,
                    IsEdited = c.IsEdited,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToList();
        }

        public async Task<CommentDto?> CreateAsync(CommentDto commentDto, int postId, string userId)
        {
            var comment = new Comment(userId)
            {
                Content = commentDto.Content,
                PostId = postId
            };

            await _communityRepository.AddCommentAsync(comment);
            var result = await _communityRepository.SaveChangesAsync();

            if (result > 0)
            {
                return commentDto;
            }

            return null;
        }
    }
}