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
    }
}