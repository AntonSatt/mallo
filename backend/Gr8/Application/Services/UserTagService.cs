using Gr8.Application.Interfaces;

//here we have the UserTagService class, which implements the IUserTagService interface. This service is responsible for managing
//user tags in the application. It interacts with the ICommunityRepository to retrieve and update user tag information in the database.
//The GetUserTagIdsAsync method retrieves the list of tag IDs associated with a specific user, while the UpdateUserTagIdsAsync
//method updates the user's tag associations by validating the provided tag IDs and replacing them in the repository if they are valid.

namespace Gr8.Application.Services
{
    public class UserTagService : IUserTagService
    {
        private readonly ICommunityRepository _communityRepository;

        public UserTagService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public async Task<List<int>> GetUserTagIdsAsync(string userId)
        {
            return await _communityRepository.GetUserTagIdsAsync(userId);
        }

        public async Task<bool> UpdateUserTagIdsAsync(string userId, List<int> tagIds)
        {
            var normalizedTagIds = (tagIds ?? new List<int>())
                .Where(id => id > 0)
                .Distinct()
                .ToList();

            var validTagIds = await _communityRepository.GetExistingTagIdsAsync(normalizedTagIds);

            if (validTagIds.Count != normalizedTagIds.Count)
            {
                return false;
            }

            await _communityRepository.ReplaceUserTagIdsAsync(userId, validTagIds);
            return true;
        }
    }
}
