using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class PortfolioAssetConfiguration : IEntityTypeConfiguration<PortfolioAsset>
{
    public void Configure(EntityTypeBuilder<PortfolioAsset> builder)
    {
        builder.ToTable("PortfolioAssets");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasMaxLength(36);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Symbol)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(p => p.Amount)
            .IsRequired()
            .HasPrecision(18, 4);

        builder.Property(p => p.PurchasePrice)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(p => p.AssetType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(p => p.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(p => p.UserId);
        builder.HasIndex(p => new { p.UserId, p.Symbol });
    }
}
