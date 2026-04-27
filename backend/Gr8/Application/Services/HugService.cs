using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Services
{
    public class HugService : IHugService
    {
        private readonly ICommunityRepository _communityRepository;

        public HugService(ICommunityRepository communityRepository) 
        {
            _communityRepository = communityRepository;
        }
        public async Task<bool> TogglePostHugAsync(int postId, string userId)
        {
            var existingHug = await _communityRepository.GetPostHugAsync(postId, userId);

            if (existingHug != null) 
            {
                _communityRepository.RemoveHug(existingHug);
                await _communityRepository.SaveChangesAsync();
                return false;
            }

            var hug = new Hug 
            {
                UserId = userId,
                PostId = postId,
                CommentId = null
            };
            
            await _communityRepository.AddHugAsync(hug);
            await _communityRepository.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ToggleCommentHugAsync(int commentId, string userId)
        {
            var existingHug = await _communityRepository.GetCommentHugAsync(commentId, userId);

            if (existingHug != null) 
            {
                _communityRepository.RemoveHug(existingHug);
                await _communityRepository.SaveChangesAsync();
                return false;
            }

            var hug = new Hug 
            {
                UserId = userId,
                CommentId = commentId,
                PostId = null
            };

            await _communityRepository.AddHugAsync(hug);
            await _communityRepository.SaveChangesAsync();
            return true;
        }
    }
}
