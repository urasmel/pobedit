using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlService.Migrations
{
    public partial class RenameTablesAndIdColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Posts",
                newName: "PostId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Channels",
                newName: "ChannelId");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Accounts",
                newName: "AccountName");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Accounts",
                newName: "AccountId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "Posts",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ChannelId",
                table: "Channels",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "AccountName",
                table: "Accounts",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "AccountId",
                table: "Accounts",
                newName: "Id");
        }
    }
}
