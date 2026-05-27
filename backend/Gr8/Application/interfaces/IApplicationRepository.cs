
using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    public interface IApplicationRepository
    {
        Task<int> GetAvatarIdByUserIdAsync(string userId);
        Task<string?> GetFullNameByIdAsync(string userId);
        Task<string?> GetUserNameByIdAsync(string userId);
        Task<string?> GetAuthorDisplayNameForNewContentAsync(string userId);
        Task<Dictionary<string, AuthorIdentityDto>> GetAuthorIdentitiesByUserIdsAsync(IEnumerable<string> userIds);
    }
}