using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.DTOs
{
    //This file is for when backend sends back a message to frontend.
    public class ChatMessageResponseDto
    {
        public int Id { get; set; }
        public string SenderId { get; set; } = null!;
        public string ReceiverId { get; set; } = null!;
        public int? ActivityId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime SendAt { get; set; }
        public bool IsRead { get; set; }
    }
}
