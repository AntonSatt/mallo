using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class PostHug
    {
        public int postId { get; set; }
        public Post Post { get; set; } = null!;

        public string userId { get; set; } = null!;
    }
}
