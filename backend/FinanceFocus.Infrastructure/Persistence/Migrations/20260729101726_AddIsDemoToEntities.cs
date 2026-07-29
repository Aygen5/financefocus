using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceFocus.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDemoToEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "Transactions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "Subscriptions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "SecurityAuditEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "RefreshTokens",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "PortfolioAssets",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "Notifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "Goals",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "ForecastHistories",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "FinancialHealthHistories",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "Budgets",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "AIConversations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "ActivityLogs",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "SecurityAuditEvents");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "RefreshTokens");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "PortfolioAssets");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "Goals");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "ForecastHistories");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "FinancialHealthHistories");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "AIConversations");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "ActivityLogs");
        }
    }
}
