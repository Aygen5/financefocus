using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Auth;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace FinanceFocus.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(UserManager<AppUser> userManager, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userManager = userManager;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return Result<AuthResponseDto>.Failure("Bu e-posta adresi zaten kayıtlı.");
        }

        var user = new AppUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Role = "User"
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return Result<AuthResponseDto>.Failure("Kayıt işlemi başarısız.", errors);
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = MapToUserDto(user);

        var response = new AuthResponseDto
        {
            Token = token,
            User = userDto
        };

        return Result<AuthResponseDto>.Success(response, "Kayıt başarıyla gerçekleşti.");
    }

    public async Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            return Result<AuthResponseDto>.Failure("Geçersiz e-posta veya şifre.");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
        {
            return Result<AuthResponseDto>.Failure("Geçersiz e-posta veya şifre.");
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = MapToUserDto(user);

        var response = new AuthResponseDto
        {
            Token = token,
            User = userDto
        };

        return Result<AuthResponseDto>.Success(response, "Giriş başarılı.");
    }

    public async Task<Result<UserDto>> GetCurrentUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return Result<UserDto>.Failure("Kullanıcı bulunamadı.");
        }

        var userDto = MapToUserDto(user);
        return Result<UserDto>.Success(userDto);
    }

    private static UserDto MapToUserDto(AppUser user)
    {
        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            Role = user.Role
        };
    }
}
