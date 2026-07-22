using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class BudgetService : IBudgetService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public BudgetService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<BudgetDto>>> GetUserBudgetsAsync(string userId)
    {
        var budgets = await _unitOfWork.Budgets.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<BudgetDto>>(budgets);
        return Result<IEnumerable<BudgetDto>>.Success(dtos);
    }

    public async Task<Result<BudgetDto>> CreateBudgetAsync(CreateBudgetDto dto, string userId)
    {
        var budget = _mapper.Map<Budget>(dto);
        budget.UserId = userId;

        await _unitOfWork.Budgets.AddAsync(budget);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<BudgetDto>(budget);
        return Result<BudgetDto>.Success(resultDto, "Bütçe limiti başarıyla eklendi.");
    }

    public async Task<Result<BudgetDto>> UpdateBudgetAsync(string id, UpdateBudgetDto dto, string userId)
    {
        var budget = await _unitOfWork.Budgets.GetByIdAsync(id);
        if (budget == null || budget.UserId != userId)
        {
            return Result<BudgetDto>.Failure("Bütçe kaydı bulunamadı.");
        }

        _mapper.Map(dto, budget);
        _unitOfWork.Budgets.Update(budget);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<BudgetDto>(budget);
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

        return Result.Success("Bütçe limiti silindi.");
    }
}
