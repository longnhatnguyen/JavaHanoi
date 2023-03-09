using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E.Contract.API.Migrations
{
    public partial class initial2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "income",
                table: "category_ratio",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "income",
                table: "category_ratio");
        }
    }
}
