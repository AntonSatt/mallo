using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Post
    {
        // Parameterless constructor required for EF Core materialization
        public Post()
        {
            Tags = new List<Tag>();
            Comments = new List<Comment>();
            CreatedAt = DateTime.Now;
        }

        // Constructor to initialize required properties from domain logic
        public Post(string userId, int categoryId, List<Tag> tags) : this()
        {
            UserId = userId;
            CategoryId = categoryId;
            Tags = tags;
        }

        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public string Title { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsEdited { get; set; }

        public int CategoryId { get; private set; } //FK
        public Category Category { get; set; } = null!;

        public string UserId { get; private set; } = null!; // FK

        public ICollection<Tag> Tags { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<PostHug> Hugs { get; set; } = new List<PostHug>();
    }
}
