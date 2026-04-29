using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System.Xml.Linq;

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

            var post = new Post(userId, createPostDto.CategoryId, tags)
            {
                Content = createPostDto.Content,
                Title = createPostDto.Title,
            };

            await _communityRepository.AddPostAsync(post);
            var result = await _communityRepository.SaveChangesAsync();

            if (result <= 0)
            {
                return null;
            }

            var category = await _communityRepository.GetCategoryByIdAsync(post.CategoryId);

            var postDto = new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                IsEdited = post.IsEdited,
                IsDeleted = post.IsDeleted,
                CreatedByUser = post.UserId
            };

            if (category != null)
            {
                postDto.Category = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };
            }

            var userName = await _applicationRepository.GetUserNameByIdAsync(post.UserId);

            if (userName != null)
            {
                postDto.UserName = userName;
            }

            return postDto;
        }

        public async Task<List<PostDto>> GetAllPostsAsync()
        {
            var posts = await _communityRepository.GetAllPostsAsync();
            var postDtoList = new List<PostDto>();

            foreach (var post in posts)
            {
                var postDto = new PostDto
                {
                    Id = post.Id,
                    Title = post.Title,
                    Content = post.Content,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    IsDeleted = post.IsDeleted,
                    IsEdited = post.IsEdited,
                    CreatedByUser = post.UserId,
                    Category = new CategoryDto
                    {
                        Name = post.Category.Name,
                        Id = post.Category.Id
                    }
                };

                var userName = await _applicationRepository.GetUserNameByIdAsync(post.UserId);

                if (userName != null)
                {
                    postDto.UserName = userName;
                }

                postDtoList.Add(postDto);
            }

            return postDtoList;
        }

        public async Task<PostDto> GetPostByIdAsync(int postId, string userId)
        {
            var post = await _communityRepository.GetPostByIdAsync(postId);

            var postDto = new PostDto
            {
                Category = new CategoryDto { Id = post.CategoryId, Name = post.Category.Name},
                Content = post.Content,
                Title = post.Title,
                CreatedAt = post.CreatedAt,
                IsDeleted = post.IsDeleted, 
                IsEdited = post.IsEdited,
                UpdatedAt= post.UpdatedAt,
                CreatedByUser = post.UserId
            };
            return postDto;
        }

        public async Task<int> UpdatePostAsync(PostDto postDto)
        {
            var oldPost = await _communityRepository.GetPostByIdAsync(postDto.Id);
            if (oldPost == null)
            {
                throw new InvalidOperationException("Post not found.");
            }

            oldPost.Title = postDto.Title;
            oldPost.Content = postDto.Content;
            oldPost.IsEdited = true;
            oldPost.UpdatedAt = DateTime.UtcNow;

            await _communityRepository.UpdatePostAsync(oldPost);
            return await _communityRepository.SaveChangesAsync();
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

            var isDeleted = await _communityRepository.DeletePostAsync(postId);
            
            if (!isDeleted)
            {
                return false;
            }

            var result = await _communityRepository.SaveChangesAsync();
            return result > 0;
        }
    }
}