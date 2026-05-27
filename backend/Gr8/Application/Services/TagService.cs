using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;

// This file defines the TagService class, which implements the ITagService interface. The TagService is responsible for managing
// tag-related operations in the application. It interacts with the ICommunityRepository to retrieve tag information from the database.

namespace Gr8.Application.Services
{
    public class TagService : ITagService
    {
        private readonly ICommunityRepository _communityRepository;

        public TagService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public async Task<List<TagDto>> GetAllTagsAsync()
        {
            var tags = await _communityRepository.GetAllTagsAsync();

            return tags.Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name
            }).ToList();
        }
    }
}
