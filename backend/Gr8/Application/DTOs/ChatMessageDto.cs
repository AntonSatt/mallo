using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class ChatMessageDto
    {
        [Required(ErrorMessage = "Content can not be empty")]
        [MaxLength(4000, ErrorMessage = "Content is to long. Max 4000 characters.")]
        public string Content { get; set; } = string.Empty;
    }
}
