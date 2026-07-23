using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceFocus.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrentPriceToPortfolioAsset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CurrentPrice",
                table: "PortfolioAssets",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentPrice",
                table: "PortfolioAssets");
        }
    }
}
