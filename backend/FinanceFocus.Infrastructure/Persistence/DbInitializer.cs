using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace FinanceFocus.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        if (!await roleManager.RoleExistsAsync("User"))
        {
            await roleManager.CreateAsync(new IdentityRole("User"));
        }

        var demoEmail = "demo@financefocus.com";
        var demoUser = await userManager.FindByEmailAsync(demoEmail);

        if (demoUser == null)
        {
            demoUser = new AppUser
            {
                UserName = demoEmail,
                Email = demoEmail,
                FirstName = "Demo",
                LastName = "Kullanıcı",
                Role = "User",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(demoUser, "Password123!");
        }
    }
}
