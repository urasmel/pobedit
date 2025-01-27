using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gather.Migrations
{
    public partial class ChangeAccountFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Accounts",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "Avatar",
                table: "Accounts",
                newName: "Photo");

            migrationBuilder.RenameColumn(
                name: "AccountName",
                table: "Accounts",
                newName: "Phone");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Accounts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Accounts",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Accounts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MainUsername",
                table: "Accounts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isBot",
                table: "Accounts",
                type: "boolean",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "MainUsername",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "isBot",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Accounts",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Photo",
                table: "Accounts",
                newName: "Avatar");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Accounts",
                newName: "AccountName");
        }
    }
}
