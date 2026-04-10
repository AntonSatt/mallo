using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class CommentDto
    {
        [Required(ErrorMessage = "Content is required")]
        [MaxLength(500)]
        public string Content { get; set; } 
        public bool IsDeleted { get; set; }
        public bool IsEdited { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}