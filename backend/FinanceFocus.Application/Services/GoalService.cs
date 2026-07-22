using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class GoalService : IGoalService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GoalService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<GoalDto>>> GetUserGoalsAsync(string userId)
    {
        var goals = await _unitOfWork.Goals.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<GoalDto>>(goals);
        return Result<IEnumerable<GoalDto>>.Success(dtos);
    }

    public async Task<Result<GoalDto>> CreateGoalAsync(CreateGoalDto dto, string userId)
    {
        var goal = _mapper.Map<Goal>(dto);
        goal.UserId = userId;

        await _unitOfWork.Goals.AddAsync(goal);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<GoalDto>(goal);
        return Result<GoalDto>.Success(resultDto, "Hedef başarıyla oluşturuldu.");
    }

    public async Task<Result<GoalDto>> UpdateGoalAsync(string id, UpdateGoalDto dto, string userId)
    {
        var goal = await _unitOfWork.Goals.GetByIdAsync(id);
        if (goal == null || goal.UserId != userId)
        {
            return Result<GoalDto>.Failure("Hedef kaydı bulunamadı.");
        }

        _mapper.Map(dto, goal);
        _unitOfWork.Goals.Update(goal);
        await _unitOfWork.SaveChangesAsync();

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

        return Result.Success("Hedef başarıyla silindi.");
    }
}
