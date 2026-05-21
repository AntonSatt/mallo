using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class ActivityDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Url { get; set; }
        public string FullName { get; set; } = null!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsEdited { get; set; }
        public string UserId { get; set; } = null!;

        public byte[]? Image { get; set; }
        public string? ImageMimeType { get; set; }
    }
}
