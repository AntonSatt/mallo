using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gr8.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAvatarRangeTo18 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_AspNetUsers_Avatar_Range",
                table: "AspNetUsers");

            migrationBuilder.AddCheckConstraint(
                name: "CK_AspNetUsers_Avatar_Range",
                table: "AspNetUsers",
                sql: "[Avatar] BETWEEN 1 AND 18");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_AspNetUsers_Avatar_Range",
                table: "AspNetUsers");

            migrationBuilder.AddCheckConstraint(
                name: "CK_AspNetUsers_Avatar_Range",
                table: "AspNetUsers",
                sql: "[Avatar] BETWEEN 1 AND 9");
        }
    }
}
