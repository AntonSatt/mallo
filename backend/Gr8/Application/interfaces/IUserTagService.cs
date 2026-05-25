namespace Gr8.Application.Interfaces
{
    public interface IUserTagService
    {
        Task<List<int>> GetUserTagIdsAsync(string userId);
        Task<bool> UpdateUserTagIdsAsync(string userId, List<int> tagIds);
    }
}
