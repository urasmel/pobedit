using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlService.Migrations
{
    public partial class ReturnChannelIdColumnName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChannelId",
                table: "Channels",
                newName: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Channels",
                newName: "ChannelId");
        }
    }
}
