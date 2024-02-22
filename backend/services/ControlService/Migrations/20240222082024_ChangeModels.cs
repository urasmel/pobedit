using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ControlService.Migrations
{
    public partial class ChangeModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Channel_ChannelId",
                table: "Posts");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Channel");

            migrationBuilder.DropIndex(
                name: "IX_Posts_ChannelId",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Posts",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "Created",
                table: "Posts",
                newName: "Date");

            migrationBuilder.RenameColumn(
                name: "ChannelId",
                table: "Posts",
                newName: "PeerId");

            migrationBuilder.CreateTable(
                name: "Channels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Info = table.Column<string>(type: "text", nullable: false),
                    InviteLink = table.Column<string>(type: "text", nullable: false),
                    Icon = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Channels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Info = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<byte[]>(type: "bytea", nullable: true),
                    ChannelId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Accounts_Channels_ChannelId",
                        column: x => x.ChannelId,
                        principalTable: "Channels",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "Id", "ChannelId", "Icon", "Info", "Password", "PhoneNumber", "Username" },
                values: new object[] { 1, null, null, null, "pass", "+79123456789", "firstUser" });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_ChannelId",
                table: "Accounts",
                column: "ChannelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Channels");

            migrationBuilder.RenameColumn(
                name: "PeerId",
                table: "Posts",
                newName: "ChannelId");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Posts",
                newName: "Text");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Posts",
                newName: "Created");

            migrationBuilder.CreateTable(
                name: "Channel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Icon = table.Column<byte[]>(type: "bytea", nullable: false),
                    Info = table.Column<string>(type: "text", nullable: false),
                    InviteLink = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Channel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChannelId = table.Column<int>(type: "integer", nullable: true),
                    Icon = table.Column<byte[]>(type: "bytea", nullable: true),
                    Info = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Username = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Account_Channel_ChannelId",
                        column: x => x.ChannelId,
                        principalTable: "Channel",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Account",
                columns: new[] { "Id", "ChannelId", "Icon", "Info", "Password", "PhoneNumber", "Username" },
                values: new object[] { 1, null, null, null, "pass", "+79123456789", "firstUser" });

            migrationBuilder.CreateIndex(
                name: "IX_Posts_ChannelId",
                table: "Posts",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_Account_ChannelId",
                table: "Account",
                column: "ChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Channel_ChannelId",
                table: "Posts",
                column: "ChannelId",
                principalTable: "Channel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
