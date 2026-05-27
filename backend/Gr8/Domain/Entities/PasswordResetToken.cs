
namespace Gr8.Domain.Entities
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public bool Used { get; set; } = false;
    }
}
