using System.ComponentModel.DataAnnotations;

namespace Gr8.Application.DTOs
{
    public class UpdatePasswordDto
    {
        public UpdatePasswordDto(string currentPassword, string newPassword, string confirmNewPassword)
        {
            CurrentPassword = currentPassword;
            NewPassword = newPassword;
            ConfirmNewPassword = confirmNewPassword;
        }

        [DataType(DataType.Password)]
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        [Compare(nameof(NewPassword), ErrorMessage = "Password don't match")]
        public string ConfirmNewPassword { get; set; }
    }
}