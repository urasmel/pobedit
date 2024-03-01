using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ControlService.Migrations
{
    public partial class AddPosts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "Info",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Info",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Channels",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "InviteLink",
                table: "Channels",
                newName: "MainUsername");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Accounts",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Accounts",
                newName: "Bio");

            migrationBuilder.AddColumn<bool>(
                name: "IsChannel",
                table: "Channels",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsGroup",
                table: "Channels",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Password", "PhoneNumber", "Username" },
                values: new object[] { 1, "pass", "+79123456789", "firstUser" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropColumn(
                name: "IsChannel",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "IsGroup",
                table: "Channels");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Channels",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "MainUsername",
                table: "Channels",
                newName: "InviteLink");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Accounts",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "Bio",
                table: "Accounts",
                newName: "Password");

            migrationBuilder.AddColumn<byte[]>(
                name: "Icon",
                table: "Channels",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<string>(
                name: "Info",
                table: "Channels",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<byte[]>(
                name: "Icon",
                table: "Accounts",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info",
                table: "Accounts",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "Id", "ChannelId", "Icon", "Info", "Password", "PhoneNumber", "Username" },
                values: new object[] { 1, null, null, null, "pass", "+79123456789", "firstUser" });
        }
    }
}
