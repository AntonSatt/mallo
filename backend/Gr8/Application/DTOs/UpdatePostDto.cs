using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class UpdatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int CategoryId { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
    }
}
