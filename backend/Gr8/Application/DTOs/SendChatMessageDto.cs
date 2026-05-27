using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    //This file is for when frontend sends a new message.
    public class SendChatMessageDto
    {
        [Required]
        public string ReceiverId { get; set; } = null!;
        public int? ActivityId { get; set; }

        [Required, MaxLength(4000)]
        public string Content { get; set; } = null!;
    }
}
