using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICommunityRepository _communityRepository;

        public CategoryService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }
        

        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _communityRepository.GetAllCategoriesAsync();

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();
        }
    }
}
