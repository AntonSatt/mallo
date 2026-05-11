using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string SenderId { get; set; } = null!;
        public string ReceiverId { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime SendAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;

        public int ActivityId { get; set; } //FK
        public Activity Activity { get; set; } = null!;
    }
}
