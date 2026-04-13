using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class ReportDto
    {
        public int PostId { get; set; }
        public int CommentId { get; set; }

        [Required(ErrorMessage = "Reason is required")]
        public string Reason { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
