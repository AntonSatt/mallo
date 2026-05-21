namespace Gr8.Domain.Entities
{
    public class Activity
    {
        public Activity() 
        { 

        }

        public Activity(string userId) : this()
        { 
            UserId = userId;
        }

        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } =null!;
        public string Url { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsEdited { get; set; }

        public byte[]? Image { get; set; }
        public string? ImageMimeType { get; set; }

        public string UserId { get; private set; } = null!; //FK
    }
}
