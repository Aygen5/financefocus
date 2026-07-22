using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasMaxLength(36);

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(t => t.Amount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(t => t.TransactionDate)
            .IsRequired();

        builder.Property(t => t.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(t => t.TransactionType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(t => t.PaymentMethod)
            .HasMaxLength(50);

        builder.Property(t => t.Account)
            .HasMaxLength(50);

        builder.Property(t => t.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(t => t.UserId);
        builder.HasIndex(t => new { t.UserId, t.TransactionDate });
        builder.HasIndex(t => t.Category);
    }
}
