namespace Gr8.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(string userId, string email, string username, int avatar = 1);
    }
}
