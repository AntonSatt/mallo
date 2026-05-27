using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Emit;
using System.Text;
using System.Xml.Linq;

namespace Gr8.Application.DTOs
{
    public class UpdateProfileDto
    {
        [Range(1, 18, ErrorMessage = "Avatar must be between 1 and 18.")]
        public int Avatar { get; set; }
        [MaxLength(50)]
        public string Username { get; set; }
        [MaxLength(50)]
        public string FirstName { get; set; }
        [MaxLength(50)]
        public string LastName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
    }
}