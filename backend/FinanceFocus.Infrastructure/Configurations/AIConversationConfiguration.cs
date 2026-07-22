using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceFocus.Infrastructure.Configurations;

public class AIConversationConfiguration : IEntityTypeConfiguration<AIConversation>
{
    public void Configure(EntityTypeBuilder<AIConversation> builder)
    {
        builder.ToTable("AIConversations");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasMaxLength(36);

        builder.Property(c => c.MessageText)
            .IsRequired()
            .HasMaxLength(4000);

        builder.Property(c => c.Sender)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.Timestamp)
            .IsRequired();

        builder.Property(c => c.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(c => c.UserId);
        builder.HasIndex(c => new { c.UserId, c.Timestamp });
    }
}
