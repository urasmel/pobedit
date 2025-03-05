using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gather.Migrations
{
    public partial class ReturnChatAndChannelOner : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "OwnerId",
                table: "Chat",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "OwnerId",
                table: "Channels",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Chat_OwnerId",
                table: "Chat",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_OwnerId",
                table: "Channels",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Channels_Accounts_OwnerId",
                table: "Channels",
                column: "OwnerId",
                principalTable: "Accounts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_Accounts_OwnerId",
                table: "Chat",
                column: "OwnerId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Channels_Accounts_OwnerId",
                table: "Channels");

            migrationBuilder.DropForeignKey(
                name: "FK_Chat_Accounts_OwnerId",
                table: "Chat");

            migrationBuilder.DropIndex(
                name: "IX_Chat_OwnerId",
                table: "Chat");

            migrationBuilder.DropIndex(
                name: "IX_Channels_OwnerId",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Channels");
        }
    }
}
