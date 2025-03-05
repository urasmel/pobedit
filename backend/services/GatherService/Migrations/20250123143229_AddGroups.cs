using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gather.Migrations
{
    public partial class AddGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccountGroup_Group_SubscriptionGroupsId",
                table: "AccountGroup");

            migrationBuilder.DropForeignKey(
                name: "FK_Group_Accounts_OwnerId",
                table: "Group");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Group",
                table: "Group");

            migrationBuilder.RenameTable(
                name: "Group",
                newName: "Groups");

            migrationBuilder.RenameIndex(
                name: "IX_Group_OwnerId",
                table: "Groups",
                newName: "IX_Groups_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Groups",
                table: "Groups",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountGroup_Groups_SubscriptionGroupsId",
                table: "AccountGroup",
                column: "SubscriptionGroupsId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Accounts_OwnerId",
                table: "Groups",
                column: "OwnerId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccountGroup_Groups_SubscriptionGroupsId",
                table: "AccountGroup");

            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Accounts_OwnerId",
                table: "Groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Groups",
                table: "Groups");

            migrationBuilder.RenameTable(
                name: "Groups",
                newName: "Group");

            migrationBuilder.RenameIndex(
                name: "IX_Groups_OwnerId",
                table: "Group",
                newName: "IX_Group_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Group",
                table: "Group",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AccountGroup_Group_SubscriptionGroupsId",
                table: "AccountGroup",
                column: "SubscriptionGroupsId",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Group_Accounts_OwnerId",
                table: "Group",
                column: "OwnerId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }
    }
}
