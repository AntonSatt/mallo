
namespace Gr8.Domain.Entities
{
    public class Bookmark
    {
        public int Id { get; set; }   
        public string UserId { get; set; }

        public int PostId { get; set; }
        public Post? Post { get; set; }
    }
}
