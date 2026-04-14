using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gr8.Infrastructure.Migrations.CommunityDb
{
    /// <inheritdoc />
    public partial class MapApplicationUserToAspNetUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_ApplicationUser_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_ApplicationUser_UserId",
                table: "Posts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ApplicationUser",
                table: "ApplicationUser");

            // Conditionally rename the old ApplicationUser table to AspNetUsers only if AspNetUsers
            // does not already exist. If AspNetUsers exists, drop the old ApplicationUser table.
            // This avoids a duplicate-object error when AspNetUsers was created by the Identity DbContext.
            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'dbo.AspNetUsers', N'U') IS NULL
                BEGIN
                    IF OBJECT_ID(N'dbo.ApplicationUser', N'U') IS NOT NULL
                    BEGIN
                        EXEC sp_rename N'dbo.ApplicationUser', N'AspNetUsers';
                        -- Recreate primary key on the renamed table
                        ALTER TABLE dbo.AspNetUsers ADD CONSTRAINT PK_AspNetUsers PRIMARY KEY (Id);
                    END
                END
                ELSE
                BEGIN
                    -- AspNetUsers already exists; drop the old table if present (no data merge performed)
                    IF OBJECT_ID(N'dbo.ApplicationUser', N'U') IS NOT NULL
                    BEGIN
                        DROP TABLE dbo.ApplicationUser;
                    END
                END
                ");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_AspNetUsers_UserId",
                table: "Posts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_AspNetUsers_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_AspNetUsers_UserId",
                table: "Posts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUsers",
                table: "AspNetUsers");

            // If the old ApplicationUser table exists, drop it (we already removed FKs above)
            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'dbo.ApplicationUser', N'U') IS NOT NULL
                BEGIN
                    DROP TABLE dbo.ApplicationUser;
                END
                            ");
        }
    }
}
