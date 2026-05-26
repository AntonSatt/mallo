using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Report
    {
        public int Id { get; set; }
        public string ReportedByUserId { get; set; } = null!;
        public string Reason { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = null!; //add enums for pending, reviews etc.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewedByAdminId { get; set; }

        public int? PostId { get; set; }
        public Post? Post { get; set; }

        public int? CommentId { get; set; }
        public Comment? Comment { get; set; }
    }
}
