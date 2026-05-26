using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class PostNotificationDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public bool IsSeen { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
