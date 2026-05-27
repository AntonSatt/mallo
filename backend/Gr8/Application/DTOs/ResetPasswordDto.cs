using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; } = null!;
        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; } = null!;
    }
}
