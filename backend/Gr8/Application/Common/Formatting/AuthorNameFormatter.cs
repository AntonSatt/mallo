using System.Globalization;

// This file defines the AuthorNameFormatter class, which provides a method for building a capitalized full name
// from given first and last names.

namespace Gr8.Application.Common.Formatting
{
    public static class AuthorNameFormatter
    {
        private static readonly CultureInfo SwedishCulture = CultureInfo.GetCultureInfo("sv-SE");

        public static string? BuildCapitalizedFullName(string? firstName, string? lastName)
        {
            var parts = new[] { firstName, lastName }
                .Where(part => !string.IsNullOrWhiteSpace(part))
                .Select(part => CapitalizeNamePart(part!.Trim()))
                .Where(part => !string.IsNullOrWhiteSpace(part))
                .ToList();

            if (parts.Count == 0)
            {
                return null;
            }

            return string.Join(" ", parts);
        }

        private static string CapitalizeNamePart(string namePart)
        {
            if (string.IsNullOrWhiteSpace(namePart))
            {
                return string.Empty;
            }

            if (namePart.Length == 1)
            {
                return namePart.ToUpper(SwedishCulture);
            }

            return string.Concat(
                namePart[..1].ToUpper(SwedishCulture),
                namePart[1..].ToLower(SwedishCulture));
        }
    }
}
