using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Comment(string userId)
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public bool IsEdited { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt {  get; set; }
        public string? AuthorDisplayName { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; } = null!;

        public string UserId { get; private set; } = userId;

        public int? ParentCommentId { get; set; }
        public Comment? ParentComment { get; set; }

        public ICollection<Comment> Replies { get; set; } = new List<Comment>();
        public ICollection<Hug> Hugs { get; set; } = new List<Hug>();
    }
}
