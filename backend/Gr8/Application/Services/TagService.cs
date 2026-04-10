using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

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
