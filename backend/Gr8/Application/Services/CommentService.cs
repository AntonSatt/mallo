using Gr8.Application.Common.Constants;
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
        private readonly IApplicationRepository _applicationRepository;
        private readonly INotificationService _notificationService;

        public CommentService(ICommunityRepository communityRepository, IApplicationRepository applicationRepository, INotificationService notificationService)
        {
            _communityRepository = communityRepository;
            _applicationRepository = applicationRepository;
            _notificationService = notificationService;
        }

        public async Task<List<CommentDto>> GetCommentsByPostAsync(int postId)
        {
            var comments = await _communityRepository.GetCommentsByPostAsync(postId);

            var commentsDtoList = new List<CommentDto>();

            foreach (var comment in comments)
            {
                var commentDto = new CommentDto
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    IsDeleted = comment.IsDeleted,
                    IsEdited = comment.IsEdited,
                    CreatedAt = comment.CreatedAt,
                    UpdatedAt = comment.UpdatedAt,
                    AuthorInfo = new AuthorDTO
                    {
                        Id = comment.UserId,
                        AvatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(comment.UserId)
                    }
                };

                var userName = await _applicationRepository.GetUserNameByIdAsync(comment.UserId);

                if (userName != null)
                {
                    commentDto.AuthorInfo.UserName = userName;
                }

                commentsDtoList.Add(commentDto);

            }

            return commentsDtoList;
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

            if (result < 0)
            {
                return null;
            }

            var userName = await _applicationRepository.GetUserNameByIdAsync(comment.UserId);

            var resultDto = new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt,
                IsDeleted = comment.IsDeleted,
                IsEdited = comment.IsEdited,
                AuthorInfo = new AuthorDTO
                {
                    Id = comment.UserId,
                    AvatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(comment.UserId)
                }
            };

            if (userName != null)
            {
                resultDto.AuthorInfo.UserName = userName;
            }

            await _notificationService.AddNotificationAsync(postId, NotificationTypes.CommentCreated, comment.UserId);

            return resultDto;
        }

        public async Task<bool> DeleteCommentAsync(int commentId, string userId)
        {
            var comment = await _communityRepository.GetCommentByIdAsync(commentId);

            if (comment == null)
            {
                return false;
            }

            if (comment.UserId != userId)
            {
                return false;
            }

            comment.IsDeleted = true;

            var result = await _communityRepository.SaveChangesAsync();

            return result > 0;
        }

        public async Task<CommentDto?> GetCommentByIdAsync(int commentId, string userId)
        {
            var comment = await _communityRepository.GetCommentByIdAsync(commentId);

            if (comment == null)
                return null;

            var commentDto = new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                IsDeleted = comment.IsDeleted,
                IsEdited = comment.IsEdited,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt,
                AuthorInfo = new AuthorDTO
                {
                    Id = comment.UserId,
                    AvatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(comment.UserId)
                }
            };

            var userName = await _applicationRepository.GetUserNameByIdAsync(comment.UserId);
            if (userName != null)
            {
                commentDto.AuthorInfo.UserName = userName;
            }

            return commentDto;
        }

        public async Task<int> UpdateCommentAsync(CommentDto commentDto)
        {
            var existing = await _communityRepository.GetCommentByIdAsync(commentDto.Id);
            if (existing == null)
            {
                throw new InvalidOperationException("Comment not found.");
            }

            existing.Content = commentDto.Content;
            existing.IsEdited = true;
            existing.UpdatedAt = DateTime.UtcNow;

            await _communityRepository.UpdateCommentAsync(existing);
            return await _communityRepository.SaveChangesAsync();
        }
    }
}