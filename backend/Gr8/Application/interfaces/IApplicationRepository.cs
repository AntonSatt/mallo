
namespace Gr8.Application.Interfaces
{
    public interface IApplicationRepository
    {
        Task<int> GetAvatarIdByUserIdAsync(string userId);
        Task<string?> GetFullNameByIdAsync(string userId);
        Task<string?> GetUserNameByIdAsync(string userId);
    }
}