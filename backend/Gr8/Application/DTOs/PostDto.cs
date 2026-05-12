using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string UserName { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsEdited { get; set; }
        public bool IsDeleted { get; set; }
        public CategoryDto Category { get; set; }
        public List<TagDto> Tags { get; set; }
        public string CreatedByUser { get; set; }
        public int CountOfComments { get; set; }
    }
}
