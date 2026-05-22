using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gr8.Infrastructure.Migrations.CommunityDb
{
    /// <inheritdoc />
    public partial class UpdateChatMessgeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_Activities_ActivityId",
                table: "ChatMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_Activities_ActivityId",
                table: "ChatMessages",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_Activities_ActivityId",
                table: "ChatMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_Activities_ActivityId",
                table: "ChatMessages",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
