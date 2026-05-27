using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

namespace Gr8.Application.Services
{
    public class PostService : IPostService
    {
        private readonly ICommunityRepository _communityRepository;
        private readonly IApplicationRepository _applicationRepository;

        public PostService(ICommunityRepository communityRepository, IApplicationRepository applicationRepository)
        {
            _communityRepository = communityRepository;
            _applicationRepository = applicationRepository;
        }

        public async Task<PostDto?> CreateAsync(CreatePostDto createPostDto, string userId)
        {
            var tags = await _communityRepository.GetTagsByIdAsync(createPostDto.TagIds);
            var authorDisplayName = await _applicationRepository.GetAuthorDisplayNameForNewContentAsync(userId);

            var post = new Post(userId, createPostDto.CategoryId, tags)
            {
                Content = createPostDto.Content,
                Title = createPostDto.Title,
                AuthorDisplayName = authorDisplayName
            };

            await _communityRepository.AddPostAsync(post);
            var result = await _communityRepository.SaveChangesAsync();

            if (result <= 0)
            {
                return null;
            }

            var category = await _communityRepository.GetCategoryByIdAsync(post.CategoryId);
            var authorIdentities = await _applicationRepository.GetAuthorIdentitiesByUserIdsAsync(new[] { post.UserId });
            authorIdentities.TryGetValue(post.UserId, out var authorIdentity);

            var postDto = new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                IsEdited = post.IsEdited,
                IsDeleted = post.IsDeleted,
                Tags = post.Tags.Select(t => new TagDto { Id = t.Id, Name = t.Name }).ToList(),
                AuthorInfo = new AuthorDTO
                {
                    Id = post.UserId,
                    AvatarId = authorIdentity?.AvatarId ?? 0,
                    UserName = ResolveAuthorName(post.AuthorDisplayName, authorIdentity?.UserName)
                }
            };

            if (category != null)
            {
                postDto.Category = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };
            }

            return postDto;
        }

        public async Task<List<PostDto>> GetAllPostsAsync(string userId)
        {
            var posts = await _communityRepository.GetAllPostsAsync();
            var userTagIds = await _communityRepository.GetUserTagIdsAsync(userId);
            var userTagIdSet = userTagIds.ToHashSet();

            if (userTagIdSet.Count > 0)
            {
                posts = posts
                    .Where(post => !post.Tags.Any(tag => userTagIdSet.Contains(tag.Id)))
                    .ToList();
            }

            var authorIdentities = await _applicationRepository.GetAuthorIdentitiesByUserIdsAsync(posts.Select(p => p.UserId));
            var postDtoList = new List<PostDto>(posts.Count);

            foreach (var post in posts)
            {
                authorIdentities.TryGetValue(post.UserId, out var authorIdentity);

                postDtoList.Add(new PostDto
                {
                    Id = post.Id,
                    Title = post.Title,
                    Content = post.Content,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    IsDeleted = post.IsDeleted,
                    IsEdited = post.IsEdited,
                    Category = new CategoryDto
                    {
                        Name = post.Category.Name,
                        Id = post.Category.Id
                    },
                    Tags = post.Tags.Select(t => new TagDto { Id = t.Id, Name = t.Name }).ToList(),
                    CountOfComments = post.Comments.Count,
                    AuthorInfo = new AuthorDTO
                    {
                        Id = post.UserId,
                        AvatarId = authorIdentity?.AvatarId ?? 0,
                        UserName = ResolveAuthorName(post.AuthorDisplayName, authorIdentity?.UserName)
                    }
                });
            }

            return postDtoList.OrderByDescending(p => p.CreatedAt).ToList();
        }

        public async Task<PostDto> GetPostByIdAsync(int postId, string userId)
        {
            var post = await _communityRepository.GetPostByIdAsync(postId);
            var authorIdentities = await _applicationRepository.GetAuthorIdentitiesByUserIdsAsync(new[] { post.UserId });
            authorIdentities.TryGetValue(post.UserId, out var authorIdentity);

            return new PostDto
            {
                Category = new CategoryDto { Id = post.CategoryId, Name = post.Category.Name },
                Content = post.Content,
                Title = post.Title,
                CreatedAt = post.CreatedAt,
                IsDeleted = post.IsDeleted,
                IsEdited = post.IsEdited,
                UpdatedAt = post.UpdatedAt,
                Id = post.Id,
                Tags = post.Tags.Select(t => new TagDto { Id = t.Id, Name = t.Name }).ToList(),
                AuthorInfo = new AuthorDTO
                {
                    Id = post.UserId,
                    AvatarId = authorIdentity?.AvatarId ?? 0,
                    UserName = ResolveAuthorName(post.AuthorDisplayName, authorIdentity?.UserName)
                }
            };
        }

        public async Task<PostDto?> UpdatePostAsync(int postId, UpdatePostDto updatePostDto, string userId)
        {
            var oldPost = await _communityRepository.GetPostByIdAsync(postId);
            if (oldPost == null)
            {
                throw new InvalidOperationException("Post not found.");
            }

            oldPost.Title = updatePostDto.Title;
            oldPost.Content = updatePostDto.Content;
            oldPost.IsEdited = true;
            oldPost.UpdatedAt = DateTime.UtcNow;

            var updatedTags = await _communityRepository.GetTagsByIdAsync(updatePostDto.TagIds);
            if (updatedTags.Count > 0)
            {
                oldPost.Tags = updatedTags;
            }
            else
            {
                oldPost.Tags.Clear();
            }

            var category = await _communityRepository.GetCategoryByIdAsync(updatePostDto.CategoryId);
            if (category != null)
            {
                oldPost.Category = category;
            }

            await _communityRepository.UpdatePostAsync(oldPost);
            var result = await _communityRepository.SaveChangesAsync();

            if (result > 0)
            {
                var authorIdentities = await _applicationRepository.GetAuthorIdentitiesByUserIdsAsync(new[] { oldPost.UserId });
                authorIdentities.TryGetValue(oldPost.UserId, out var authorIdentity);

                return new PostDto
                {
                    Id = oldPost.Id,
                    Title = oldPost.Title,
                    Content = oldPost.Content,
                    CreatedAt = oldPost.CreatedAt,
                    UpdatedAt = oldPost.UpdatedAt,
                    IsEdited = oldPost.IsEdited,
                    IsDeleted = oldPost.IsDeleted,
                    Tags = oldPost.Tags.Select(t => new TagDto { Id = t.Id, Name = t.Name }).ToList(),
                    Category = new CategoryDto { Id = oldPost.CategoryId, Name = oldPost.Category.Name },
                    AuthorInfo = new AuthorDTO
                    {
                        Id = oldPost.UserId,
                        AvatarId = authorIdentity?.AvatarId ?? 0,
                        UserName = ResolveAuthorName(oldPost.AuthorDisplayName, authorIdentity?.UserName)
                    }
                };
            }

            return null;
        }

        public async Task<bool> DeletePostAsync(int postId, string userId)
        {
            var post = await _communityRepository.GetPostByIdAsync(postId);
            if (post == null)
            {
                return false;
            }

            if (post.UserId != userId)
            {
                return false;
            }

            post.IsDeleted = true;

            foreach (var comment in post.Comments)
            {
                comment.IsDeleted = true;
            }

            var result = await _communityRepository.SaveChangesAsync();

            return result > 0;
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