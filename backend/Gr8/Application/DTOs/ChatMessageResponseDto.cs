
namespace Gr8.Application.DTOs
{
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
