using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;
using FluentValidation;

namespace FinanceFocus.Application.Services;

public class GoalService : IGoalService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateGoalDto> _createValidator;
    private readonly IValidator<UpdateGoalDto> _updateValidator;

    public GoalService(
        IUnitOfWork unitOfWork,
        ICacheService cacheService,
        IMapper mapper,
        IValidator<CreateGoalDto> createValidator,
        IValidator<UpdateGoalDto> updateValidator)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<Result<IEnumerable<GoalDto>>> GetUserGoalsAsync(string userId)
    {
        var goals = await _unitOfWork.Goals.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<GoalDto>>(goals);
        return Result<IEnumerable<GoalDto>>.Success(dtos);
    }

    public async Task<Result<GoalDto>> GetGoalByIdAsync(string id, string userId)
    {
        var goal = await _unitOfWork.Goals.GetByIdAsync(id);
        if (goal == null || goal.UserId != userId)
        {
            return Result<GoalDto>.Failure("Hedef kaydı bulunamadı.");
        }

        var dto = _mapper.Map<GoalDto>(goal);
        return Result<GoalDto>.Success(dto);
    }

    public async Task<Result<GoalDto>> CreateGoalAsync(CreateGoalDto dto, string userId)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<GoalDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        if (dto.Deadline <= DateTime.UtcNow)
        {
            return Result<GoalDto>.Failure("Hedef son tarihi gelecekte bir tarih olmalıdır.");
        }

        var userGoals = await _unitOfWork.Goals.GetByUserIdAsync(userId);
        var isDuplicate = userGoals.Any(g => string.Equals(g.Name, dto.Name, StringComparison.OrdinalIgnoreCase));
        if (isDuplicate)
        {
            return Result<GoalDto>.Failure("Bu isimle zaten tanımlanmış bir hedefiniz bulunmaktadır.");
        }

        var goal = _mapper.Map<Goal>(dto);
        goal.UserId = userId;

        await _unitOfWork.Goals.AddAsync(goal);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        var resultDto = _mapper.Map<GoalDto>(goal);
        return Result<GoalDto>.Success(resultDto, "Hedef başarıyla oluşturuldu.");
    }

    public async Task<Result<GoalDto>> UpdateGoalAsync(string id, UpdateGoalDto dto, string userId)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<GoalDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        if (dto.Deadline <= DateTime.UtcNow)
        {
            return Result<GoalDto>.Failure("Hedef son tarihi gelecekte bir tarih olmalıdır.");
        }

        var goal = await _unitOfWork.Goals.GetByIdAsync(id);
        if (goal == null || goal.UserId != userId)
        {
            return Result<GoalDto>.Failure("Hedef kaydı bulunamadı.");
        }

        _mapper.Map(dto, goal);
        goal.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Goals.Update(goal);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        var resultDto = _mapper.Map<GoalDto>(goal);
        return Result<GoalDto>.Success(resultDto, "Hedef başarıyla güncellendi.");
    }

    public async Task<Result> DeleteGoalAsync(string id, string userId)
    {
        var goal = await _unitOfWork.Goals.GetByIdAsync(id);
        if (goal == null || goal.UserId != userId)
        {
            return Result.Failure("Silinecek hedef kaydı bulunamadı.");
        }

        _unitOfWork.Goals.Delete(goal);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        return Result.Success("Hedef başarıyla silindi.");
    }
}
