using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class ChatMessage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string SenderId { get; set; } = string.Empty;
        public string ReceiverId { get; set; } = string.Empty;
        public Guid ActivityId { get; set; } //the fake activity.
        public string Content { get; set; } = string.Empty;
        public DateTime SendAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}
