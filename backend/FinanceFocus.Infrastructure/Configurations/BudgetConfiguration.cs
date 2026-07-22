using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class BudgetConfiguration : IEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        builder.ToTable("Budgets");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Id)
            .HasMaxLength(36);

        builder.Property(b => b.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.Limit)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(b => b.Month)
            .IsRequired();

        builder.Property(b => b.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(b => b.UserId);
        builder.HasIndex(b => new { b.UserId, b.Category, b.Month }).IsUnique();
    }
}
