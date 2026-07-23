using FinanceFocus.Application.DTOs.Portfolio;
using FluentValidation;

namespace FinanceFocus.Application.Validators.Portfolio;

public class CreatePortfolioAssetValidator : AbstractValidator<CreatePortfolioAssetDto>
{
    public CreatePortfolioAssetValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Varlık adı boş olamaz.");

        RuleFor(x => x.Symbol)
            .NotEmpty().WithMessage("Sembol alanı boş olamaz.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Miktar sıfırdan büyük olmalıdır.");

        RuleFor(x => x.PurchasePrice)
            .GreaterThan(0).WithMessage("Alış fiyatı sıfırdan büyük olmalıdır.");

        RuleFor(x => x.CurrentPrice)
            .GreaterThan(0).WithMessage("Güncel fiyat sıfırdan büyük olmalıdır.");
    }
}
