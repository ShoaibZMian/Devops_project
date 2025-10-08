using backend2.Models;
using Microsoft.AspNetCore.Identity;

public class DataSeeder
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public DataSeeder(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedData()
    {
        if (!await _roleManager.RoleExistsAsync("Admin"))
        {
            await _roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        var adminUser = new User
        {
            UserName = "admin",
            Email = "admin@store.com"
        };

        var userExists = await _userManager.FindByNameAsync(adminUser.UserName);
        if (userExists == null)
        {
            var result = await _userManager.CreateAsync(adminUser, "Admin.store24");

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
}