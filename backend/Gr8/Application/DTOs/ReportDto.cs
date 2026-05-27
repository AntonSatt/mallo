using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class ReportDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "PostId must be greater than 0")]
        public int? PostId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "CommentId must be greater than 0")]
        public int? CommentId { get; set; }
        [Required(ErrorMessage = "Reason is required")]
        public string Reason { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
