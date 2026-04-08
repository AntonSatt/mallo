using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Comment(string userId)
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public bool isEdited { get; set; }
        public bool isDeleted { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; } = null!;

        public string UserId { get; private set; } = userId;

        public int? ParentCommentId { get; set; }
        public Comment? ParentComment { get; set; }

        public ICollection<Comment> Replies { get; set; } = new List<Comment>();
    }
}
