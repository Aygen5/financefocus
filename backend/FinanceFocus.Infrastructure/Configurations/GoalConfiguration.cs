using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class GoalConfiguration : IEntityTypeConfiguration<Goal>
{
    public void Configure(EntityTypeBuilder<Goal> builder)
    {
        builder.ToTable("Goals");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.Id)
            .HasMaxLength(36);

        builder.Property(g => g.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(g => g.TargetAmount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(g => g.CurrentAmount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(g => g.Deadline)
            .IsRequired();

        builder.Property(g => g.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(g => g.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(g => g.UserId);
        builder.HasIndex(g => new { g.UserId, g.Deadline });
    }
}
