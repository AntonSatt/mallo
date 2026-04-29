using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace Gr8.Application.DTOs
{
    public class RegisterDto
    {
        [MaxLength(50)]
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; } = string.Empty;
        [MaxLength(50)]
        [Required(ErrorMessage = "First name is required")]
        public string FirstName { get; set; } = string.Empty;
        [MaxLength(50)]
        [Required(ErrorMessage = "Last name is required")]
        public string LastName { get; set; } = string.Empty;
        [StringLength(8, MinimumLength = 8, ErrorMessage = "Social number must be 8 characters.")]
        [Required(ErrorMessage = "Social number is required")]
        public string SocialNumber { get; set; } = string.Empty;
        //public int Avatar { get; set; } //TODO: Implement avatar selection (Probably just an int that corresponds to a predefined set of avatars)
        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; set; } = string.Empty;
    }
}