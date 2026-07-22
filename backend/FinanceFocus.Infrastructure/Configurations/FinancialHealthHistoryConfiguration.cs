using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class FinancialHealthHistoryConfiguration : IEntityTypeConfiguration<FinancialHealthHistory>
{
    public void Configure(EntityTypeBuilder<FinancialHealthHistory> builder)
    {
        builder.ToTable("FinancialHealthHistories");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.Id)
            .HasMaxLength(36);

        builder.Property(h => h.CalculationDate)
            .IsRequired();

        builder.Property(h => h.Score)
            .IsRequired();

        builder.Property(h => h.Status)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(h => h.SavingsRate)
            .IsRequired()
            .HasPrecision(5, 2);

        builder.Property(h => h.DebtRatio)
            .IsRequired()
            .HasPrecision(5, 2);

        builder.Property(h => h.BudgetDiscipline)
            .IsRequired()
            .HasPrecision(5, 2);

        builder.Property(h => h.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(h => h.UserId);
        builder.HasIndex(h => new { h.UserId, h.CalculationDate });
    }
}
