using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gr8.Infrastructure.Migrations.CommunityDb
{
    /// <inheritdoc />
    public partial class AddedTimeStampToComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isEdited",
                table: "Comments",
                newName: "IsEdited");

            migrationBuilder.RenameColumn(
                name: "isDeleted",
                table: "Comments",
                newName: "IsDeleted");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Comments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Comments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "IsEdited",
                table: "Comments",
                newName: "isEdited");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "Comments",
                newName: "isDeleted");
        }
    }
}
