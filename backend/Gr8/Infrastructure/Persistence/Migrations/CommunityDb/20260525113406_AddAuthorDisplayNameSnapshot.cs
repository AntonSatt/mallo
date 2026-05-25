using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gr8.Infrastructure.Migrations.CommunityDb
{
    /// <inheritdoc />
    public partial class AddAuthorDisplayNameSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthorDisplayName",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthorDisplayName",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorDisplayName",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "AuthorDisplayName",
                table: "Comments");
        }
    }
}
