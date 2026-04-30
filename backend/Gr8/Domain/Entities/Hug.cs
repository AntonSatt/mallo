using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Hug
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;

        public int? PostId { get; set; }
        public Post? Post { get; set; }

        public int? CommentId { get; set; }
        public Comment? Comment { get; set; }
    }
}
