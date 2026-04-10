using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Post(string userId, string categoryId, List<Tag> tags)
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public string Title { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsEdited { get; set; }

        public List<Tag> Tags { get; set; } = tags;
        public string CategoryId { get; private set; } = categoryId; //FK

        public string UserId { get; private set; } = userId; // FK

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
