namespace Gr8.Application.DTOs
{
    public class AuthorIdentityDto
    {
        public string Id { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int AvatarId { get; set; }
    }
}
