using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = null!;
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = null!;
        public bool IsEdited { get; set; } 
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}