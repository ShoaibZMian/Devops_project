
using backend2.Controllers.Interfaces;
using backend2.Data;
using backend2.Data.Data_transfer_object.AccountDto;
using backend2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend2.Controller.API_EndPoints_Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController  : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJWT_TokenService _jwtTokenService;
        private readonly ApplicationDB_Context _databaseContext;

        public AdminController(UserManager<User> userManager, IJWT_TokenService jwtTokenService, ApplicationDB_Context databaseContext)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _databaseContext = databaseContext;
        }

        [HttpPost("register/admin")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> RegisterAdmin([FromBody] Post_RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var appUser = new User
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    UserName = registerDto.UserName,
                    Email = registerDto.Email
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "Admin");
                    if (!roleResult.Succeeded)
                        return StatusCode(500, roleResult.Errors);

                    return Ok(
                        new Post_NewUserDto
                        {
                            FirstName = registerDto.FirstName,
                            LastName = registerDto.LastName,
                            UserName = appUser.UserName,
                            Email = appUser.Email,
                            token = await _jwtTokenService.GenerateJwtToken(appUser)
                        }
                    );
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPost("registerUser")]
        public async Task<IActionResult> RegisterUser(User user, string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }

        [HttpPut("updateUser/{id}")]
        public async Task<IActionResult> UpdateUser(string id, User user)
        {
            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.UserName = user.UserName;

            var result = await _userManager.UpdateAsync(existingUser);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }

        [HttpPost("resetUserPassword/{id}")]
        public async Task<IActionResult> ResetUserPassword(string id, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }

        [HttpDelete("deleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }

        [HttpGet("getAllUserInfo")]
        public async Task<IActionResult> GetAllUserInfo()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("getUser/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("userCount")]
        public async Task<IActionResult> GetUserCount()
        {
            var userCount = await _userManager.Users.CountAsync();
            return Ok(userCount);
        }
        

        [HttpGet("productCount")]
        public async Task<IActionResult> GetProductCount()
        {
            var productCount = await _databaseContext.Products.CountAsync();
            return Ok(productCount);
        }
        
        
        [HttpGet("productCountByCategory")]
        public async Task<IActionResult> GetProductCountByCategory()
        {
            var productCountByCategory = await _databaseContext.Products
                .GroupBy(p => p.Category)
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(productCountByCategory);
        }



    }
}