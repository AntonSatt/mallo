using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class UpdateUserTagsDto
    {
        [Required]
        public List<int> TagIds { get; set; } = new();
    }
}
