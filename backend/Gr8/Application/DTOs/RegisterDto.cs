using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class RegisterDto
    {
        [MaxLength(50)]
        [Required]
        public string UserName { get; set; }
        [MaxLength(50)]
        [Required]
        public string FirstName { get; set; }
        [MaxLength(50)]
        [Required]
        public string LastName { get; set; }
        [MaxLength(10)]
        [Required]
        public string SocialNumber { get; set; }
        //public int Avatar { get; set; } //TODO: Implement avatar selection (Probably just an int that corresponds to a predefined set of avatars)
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}