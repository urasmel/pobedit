using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gather.Migrations
{
    public partial class ChannelAccountManyToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Channels_ChannelId",
                table: "Accounts");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_ChannelId",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "ChannelId",
                table: "Accounts");

            migrationBuilder.CreateTable(
                name: "AccountChannel",
                columns: table => new
                {
                    SubscribersId = table.Column<long>(type: "bigint", nullable: false),
                    SubscriptionChannelsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountChannel", x => new { x.SubscribersId, x.SubscriptionChannelsId });
                    table.ForeignKey(
                        name: "FK_AccountChannel_Accounts_SubscribersId",
                        column: x => x.SubscribersId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccountChannel_Channels_SubscriptionChannelsId",
                        column: x => x.SubscriptionChannelsId,
                        principalTable: "Channels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccountChannel_SubscriptionChannelsId",
                table: "AccountChannel",
                column: "SubscriptionChannelsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccountChannel");

            migrationBuilder.AddColumn<long>(
                name: "ChannelId",
                table: "Accounts",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_ChannelId",
                table: "Accounts",
                column: "ChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Channels_ChannelId",
                table: "Accounts",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id");
        }
    }
}
