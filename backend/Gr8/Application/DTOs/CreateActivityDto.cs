using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class CreateActivityDto : IValidatableObject
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = null!;
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = null!;
        public string Url { get; set; }
        [Required]
        public decimal Latitude { get; set; }
        [Required]
        public decimal Longitude { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public byte[]? Image { get; set; }
        public string? ImageMimeType { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (StartAt == DateTime.MinValue)
            {
                yield return new ValidationResult(
                    "Start date must be set",
                    new[] { nameof(StartAt) });
            }

            if (EndAt == DateTime.MinValue)
            {
                yield return new ValidationResult(
                    "End date must be set",
                    new[] { nameof(EndAt) });
            }

            if (StartAt != DateTime.MinValue &&
                EndAt != DateTime.MinValue &&
                EndAt < StartAt)
            {
                yield return new ValidationResult(
                    "End date must be after start date",
                    new[] { nameof(StartAt), nameof(EndAt) });
            }
        }
    }
}
