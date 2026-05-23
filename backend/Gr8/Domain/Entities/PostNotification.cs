using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class PostNotification
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Content { get; set; }
        public bool IsSeen { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
