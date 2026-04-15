using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class CreatePostDto
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = null!;
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = null!;
     
        public int CategoryId { get; set; }
        
        public List<int> TagIds { get; set; } = new List<int>();
    }
}