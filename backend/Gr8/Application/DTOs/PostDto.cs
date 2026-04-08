using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class PostDto
    {
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = null!;
    }
}