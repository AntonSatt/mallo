using Gr8.Domain.Entities;
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
        [Range(1, 9)]
        public int Avatar { get; set; }

        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}
