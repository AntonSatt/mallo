using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;

// This file defines the CategoryService class, which implements the ICategoryService interface. The CategoryService is
// responsible for managing category-related operations in the application. It interacts with the ICommunityRepository to
// retrieve category information from the database.
// The GetAllCategoriesAsync method retrieves all categories from the repository and maps them to a list of CategoryDto objects,
// which are then returned to the caller. This service allows other parts of the application to access category data
// without needing to directly interact with the data layer.

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
