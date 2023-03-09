using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E.Contract.API.Migrations
{
    public partial class initial6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "code",
                table: "customer",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "referral_code",
                table: "customer",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "code",
                table: "customer");

            migrationBuilder.DropColumn(
                name: "referral_code",
                table: "customer");
        }
    }
}
