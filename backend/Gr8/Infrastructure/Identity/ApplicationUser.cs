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
        public string LastName { get; set; }
    }
}
