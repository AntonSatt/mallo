using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class ChatMessageDto
    {
        [Required]
        public string ReceiverId { get; set; } = null!;

        [Required]
        public int ActivityId { get; set; }

        [Required, MaxLength(4000)]
        public string Content { get; set; } = null!;
    }
}
