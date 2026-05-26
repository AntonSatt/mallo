using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.DTOs
{
    public class ActivityCalenderDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ActivityId { get; set; }
        public string Title { get; set; }
        public DateTime StartAt { get; set; }
    }
}
