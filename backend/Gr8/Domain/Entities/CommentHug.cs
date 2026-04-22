using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class CommentHug
    {
        public int commentId { get; set; }
        public Comment Comment { get; set; } = null!;

        public string userId { get; set; } = null!;
    }
}
