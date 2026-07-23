using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;
using FluentValidation;

namespace FinanceFocus.Application.Services;

public class BudgetService : IBudgetService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateBudgetDto> _createValidator;
    private readonly IValidator<UpdateBudgetDto> _updateValidator;

    public BudgetService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IValidator<CreateBudgetDto> createValidator,
        IValidator<UpdateBudgetDto> updateValidator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<Result<IEnumerable<BudgetDto>>> GetUserBudgetsAsync(string userId)
    {
        var budgets = (await _unitOfWork.Budgets.GetByUserIdAsync(userId)).ToList();
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();

        var dtos = new List<BudgetDto>();

        foreach (var budget in budgets)
        {
            var dto = _mapper.Map<BudgetDto>(budget);

            var spentAmount = transactions
                .Where(t => t.TransactionType == TransactionType.Expense &&
                            string.Equals(t.Category, budget.Category, StringComparison.OrdinalIgnoreCase) &&
                            t.TransactionDate.Year == budget.Month.Year &&
                            t.TransactionDate.Month == budget.Month.Month)
                .Sum(t => t.Amount);

            dto.SpentAmount = spentAmount;
            dtos.Add(dto);
        }

        return Result<IEnumerable<BudgetDto>>.Success(dtos);
    }

    public async Task<Result<BudgetDto>> GetBudgetByIdAsync(string id, string userId)
    {
        var budget = await _unitOfWork.Budgets.GetByIdAsync(id);
        if (budget == null || budget.UserId != userId)
        {
            return Result<BudgetDto>.Failure("Bütçe kaydı bulunamadı.");
        }

        var dto = _mapper.Map<BudgetDto>(budget);
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();

        var spentAmount = transactions
            .Where(t => t.TransactionType == TransactionType.Expense &&
                        string.Equals(t.Category, budget.Category, StringComparison.OrdinalIgnoreCase) &&
                        t.TransactionDate.Year == budget.Month.Year &&
                        t.TransactionDate.Month == budget.Month.Month)
            .Sum(t => t.Amount);

        dto.SpentAmount = spentAmount;

        return Result<BudgetDto>.Success(dto);
    }

    public async Task<Result<BudgetDto>> CreateBudgetAsync(CreateBudgetDto dto, string userId)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<BudgetDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var existingBudgets = await _unitOfWork.Budgets.GetByUserIdAsync(userId);
        var isDuplicate = existingBudgets.Any(b =>
            string.Equals(b.Category, dto.Category, StringComparison.OrdinalIgnoreCase) &&
            b.Month.Year == dto.Month.Year &&
            b.Month.Month == dto.Month.Month);

        if (isDuplicate)
        {
            return Result<BudgetDto>.Failure("Bu kategori ve ay için zaten tanımlanmış bir bütçe bulunmaktadır.");
        }

        var budget = _mapper.Map<Budget>(dto);
        budget.UserId = userId;

        await _unitOfWork.Budgets.AddAsync(budget);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<BudgetDto>(budget);
        return Result<BudgetDto>.Success(resultDto, "Bütçe limiti başarıyla eklendi.");
    }

    public async Task<Result<BudgetDto>> UpdateBudgetAsync(string id, UpdateBudgetDto dto, string userId)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<BudgetDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var budget = await _unitOfWork.Budgets.GetByIdAsync(id);
        if (budget == null || budget.UserId != userId)
        {
            return Result<BudgetDto>.Failure("Bütçe kaydı bulunamadı.");
        }

        _mapper.Map(dto, budget);
        budget.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Budgets.Update(budget);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<BudgetDto>(budget);

        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();
        resultDto.SpentAmount = transactions
            .Where(t => t.TransactionType == TransactionType.Expense &&
                        string.Equals(t.Category, budget.Category, StringComparison.OrdinalIgnoreCase) &&
                        t.TransactionDate.Year == budget.Month.Year &&
                        t.TransactionDate.Month == budget.Month.Month)
            .Sum(t => t.Amount);

        return Result<BudgetDto>.Success(resultDto, "Bütçe limiti başarıyla güncellendi.");
    }

    public async Task<Result> DeleteBudgetAsync(string id, string userId)
    {
        var budget = await _unitOfWork.Budgets.GetByIdAsync(id);
        if (budget == null || budget.UserId != userId)
        {
            return Result.Failure("Silinecek bütçe kaydı bulunamadı.");
        }

        _unitOfWork.Budgets.Delete(budget);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Bütçe limiti başarıyla silindi.");
    }
}
