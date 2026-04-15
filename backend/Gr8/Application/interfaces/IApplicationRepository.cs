
namespace Gr8.Application.Interfaces
{
    public interface IApplicationRepository
    {
        Task<string?> GetUserNameByIdAsync(string userId);
    }
}