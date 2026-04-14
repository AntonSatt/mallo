using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}
