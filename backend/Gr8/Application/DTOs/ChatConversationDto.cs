
namespace Gr8.Application.DTOs
{
    public class ChatConversationDto
    {
        //This is for the chatpage, where the user can see the chatflow of its conversations.
        public string OtherUserId { get; set; } = null!;
        public string OtherUserFullName { get; set; } = null!;
        public string OtherUserName { get; set; } = null!;
        public int? ActivityId { get; set; }
        public string LastMessage { get; set; } = null!;
        public DateTime LastMessageAt { get; set; }
        public bool HasUnreadMessage { get; set; }
        public int AvatarId { get; set; }
    }
}
