using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Report
    {
        public int Id { get; set; }
        public string ReportedByUserId { get; private set; } = null!;

        public int? PostId { get; set; }
        public Post? Post { get; set; }

        public int CommentId { get; set; }
        public Comment? Comment { get; set; }

        public string Reason { get; set; } = null!;

        public string? Description { get; set; }

        public string Status { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string? ReviewedByAdminId { get; set; }

        public DateTime? ReviewedAt { get; set; }
    }
}
