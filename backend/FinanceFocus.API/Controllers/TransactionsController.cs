using System.Collections.Generic;
using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Transactions;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class TransactionsController : BaseApiController
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _transactionService.GetUserTransactionsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _transactionService.GetTransactionByIdAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        var result = await _transactionService.CreateTransactionAsync(dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateTransactionDto dto)
    {
        var result = await _transactionService.UpdateTransactionAsync(id, dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _transactionService.DeleteTransactionAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }
}
