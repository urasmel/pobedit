using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gather.Migrations
{
    /// <inheritdoc />
    public partial class FixIsBotCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isBot",
                table: "Accounts",
                newName: "IsBot");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsBot",
                table: "Accounts",
                newName: "isBot");
        }
    }
}
