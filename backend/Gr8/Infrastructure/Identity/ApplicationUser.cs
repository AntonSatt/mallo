using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Gr8.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
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
    }
}
