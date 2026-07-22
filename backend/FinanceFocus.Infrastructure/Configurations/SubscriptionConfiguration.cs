using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.ToTable("Subscriptions");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasMaxLength(36);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Price)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(s => s.BillingCycle)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(s => s.NextBillingDate)
            .IsRequired();

        builder.Property(s => s.Category)
            .HasMaxLength(100);

        builder.Property(s => s.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(s => s.UserId);
        builder.HasIndex(s => new { s.UserId, s.NextBillingDate });
    }
}
