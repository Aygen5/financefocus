using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class ForecastHistoryConfiguration : IEntityTypeConfiguration<ForecastHistory>
{
    public void Configure(EntityTypeBuilder<ForecastHistory> builder)
    {
        builder.ToTable("ForecastHistories");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.Id)
            .HasMaxLength(36);

        builder.Property(f => f.ForecastDate)
            .IsRequired();

        builder.Property(f => f.ProjectedIncome)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(f => f.ProjectedExpense)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(f => f.ProjectedSavings)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(f => f.AlgorithmUsed)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(f => f.UserId);
        builder.HasIndex(f => new { f.UserId, f.ForecastDate });
    }
}
