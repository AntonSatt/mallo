using Gr8.Application.Common.Constants;
using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

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
            var authorIdentities = await _applicationRepository.GetAuthorIdentitiesByUserIdsAsync(comments.Select(c => c.UserId));

            var commentsDtoList = new List<CommentDto>();

            foreach (var comment in comments)
            {
                authorIdentities.TryGetValue(comment.UserId, out var authorIdentity);

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
                        AvatarId = authorIdentity?.AvatarId ?? 0,
                        UserName = ResolveAuthorName(comment.AuthorDisplayName, authorIdentity?.UserName)
                    }
                };

                commentsDtoList.Add(commentDto);
            }

            return commentsDtoList;
        }

        public async Task<CommentDto?> CreateAsync(CommentDto commentDto, int postId, string userId)
        {
            var authorDisplayName = await _applicationRepository.GetAuthorDisplayNameForNewContentAsync(userId);

            var comment = new Comment(userId)
            {
                Content = commentDto.Content,
                PostId = postId,
                AuthorDisplayName = authorDisplayName
            };

            await _communityRepository.AddCommentAsync(comment);
            var result = await _communityRepository.SaveChangesAsync();

            if (result < 0)
            {
                return null;
            }

            var authorIdentities = await _applicationRepository.GetAuthorIdentitiesByUserIdsAsync(new[] { comment.UserId });
            authorIdentities.TryGetValue(comment.UserId, out var authorIdentity);

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
                    AvatarId = authorIdentity?.AvatarId ?? 0,
                    UserName = ResolveAuthorName(comment.AuthorDisplayName, authorIdentity?.UserName)
                }
            };

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
            {
                return null;
            }

            var authorIdentities = await _applicationRepository.GetAuthorIdentitiesByUserIdsAsync(new[] { comment.UserId });
            authorIdentities.TryGetValue(comment.UserId, out var authorIdentity);

            return new CommentDto
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
                    AvatarId = authorIdentity?.AvatarId ?? 0,
                    UserName = ResolveAuthorName(comment.AuthorDisplayName, authorIdentity?.UserName)
                }
            };
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

        private static string? ResolveAuthorName(string? authorDisplayName, string? fallbackUserName)
        {
            if (!string.IsNullOrWhiteSpace(authorDisplayName))
            {
                return authorDisplayName;
            }

            return fallbackUserName;
        }
    }
}