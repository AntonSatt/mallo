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
                Title = post.Title,

                Content = post.Content,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                IsEdited = post.IsEdited,
                IsDeleted = post.IsDeleted
            };

            if (category != null)
            {
                postDto.Category = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };
            }

            var username = await _applicationRepository.GetUserNameByIdAsync(post.UserId);

            if (username != null)
            {
                postDto.UserName = username;
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
                    Category = new CategoryDto
                    {
                        Name = post.Category.Name,
                        Id = post.Category.Id
                    }
                };

                var username = await _applicationRepository.GetUserNameByIdAsync(post.UserId);

                if (username != null)
                {
                    postDto.UserName = username;
                }

                postDtoList.Add(postDto);
            }

            return postDtoList;
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

            var result = await _communityRepository.SaveChangesAsync();
            return result > 0;
        }
    }
}