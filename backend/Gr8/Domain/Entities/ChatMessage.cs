using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class ChatMessage
    {
        public ChatMessage()
        {

        }

        public ChatMessage(string senderId, string receiverId, string content) : this() 
        {
            SenderId = senderId;
            ReceiverId = receiverId;
            Content = content;
            SendAt = DateTime.UtcNow;
        }
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime SendAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        public string SenderId { get; set; } = null!;
        public string ReceiverId { get; set; } = null!;

        public int? ActivityId { get; set; } //FK
        public Activity? Activity { get; set; } = null!;

        public bool DeletedBySender { get; set; } = false;
        public bool DeletedByReceiver { get; set; } = false;
    }
}
