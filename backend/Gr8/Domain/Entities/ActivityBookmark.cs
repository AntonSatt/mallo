
namespace Gr8.Domain.Entities
{
    public class ActivityBookmark
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ActivityId { get; set; }
        public Activity? Activity { get; set; }
    }
}
