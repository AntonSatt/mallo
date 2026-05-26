using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gr8.Infrastructure.Migrations.CommunityDb
{
    /// <inheritdoc />
    public partial class AddTypeAndTitleToNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "PostNotifications",
                newName: "Type");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "PostNotifications",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "PostNotifications");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "PostNotifications",
                newName: "Content");
        }
    }
}
