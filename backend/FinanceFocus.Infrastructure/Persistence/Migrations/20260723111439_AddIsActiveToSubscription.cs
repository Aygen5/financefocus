using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceFocus.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActiveToSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Subscriptions",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Subscriptions");
        }
    }
}
