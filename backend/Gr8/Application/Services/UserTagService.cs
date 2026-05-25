using Gr8.Application.Interfaces;

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
