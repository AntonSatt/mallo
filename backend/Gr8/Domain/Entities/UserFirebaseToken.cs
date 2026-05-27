
namespace Gr8.Domain.Entities
{
    public class UserFirebaseToken
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Token { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
