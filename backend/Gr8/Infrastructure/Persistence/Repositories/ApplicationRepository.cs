using Gr8.Application.Common.Formatting;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace Gr8.Infrastructure.Persistence.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public ApplicationRepository(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public Task<int> GetAvatarIdByUserIdAsync(string userId)
        {
            return _applicationDbContext.Users
                .Where(u => u.Id == userId)
                .Select(u => u.Avatar)
                .FirstOrDefaultAsync();
        }

        public async Task<string?> GetUserNameByIdAsync(string userId)
        {
            var user = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user?.UserName;
        }

        public async Task<string?> GetFullNameByIdAsync(string userId)
        {
            var user = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return null;
            }

            return $"{user.FirstName} {user.LastName}";
        }

        public async Task<string?> GetAuthorDisplayNameForNewContentAsync(string userId)
        {
            var authorIdentity = await _applicationDbContext.Users
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.UserName,
                    u.FirstName,
                    u.LastName,
                    u.IsAnonymousPosting
                })
                .FirstOrDefaultAsync();

            if (authorIdentity == null)
            {
                return null;
            }

            if (authorIdentity.IsAnonymousPosting)
            {
                return authorIdentity.UserName;
            }

            var fullName = AuthorNameFormatter.BuildCapitalizedFullName(authorIdentity.FirstName, authorIdentity.LastName);
            return fullName ?? authorIdentity.UserName;
        }
    }
}