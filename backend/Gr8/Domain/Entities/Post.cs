using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Post(string userId)
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; }

        public string UserId { get; private set; } = userId;

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
