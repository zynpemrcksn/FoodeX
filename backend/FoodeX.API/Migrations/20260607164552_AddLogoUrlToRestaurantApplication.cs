using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodeX.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLogoUrlToRestaurantApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "RestaurantApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "RestaurantApplications");
        }
    }
}
