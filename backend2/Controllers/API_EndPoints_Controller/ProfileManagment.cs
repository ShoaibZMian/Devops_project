using backend2.Controllers.Interfaces;
using backend2.Data.Data_transfer_object.AccountDto;
using backend2.Data.Data_transfer_object.AccountManamentDto;
using backend2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend2.Controller.API_EndPoints_Controller
{
    public class ProfileManagment : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJWT_TokenService _jwtTokenService;

        public ProfileManagment(UserManager<User> userManager, SignInManager<User> signInManager, IJWT_TokenService jwtTokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("updateAccount")]
        public async Task<IActionResult> UpdateAccount(UpdateAccountDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Find the user by username
                var user = await _userManager.FindByNameAsync(updateDto.Username.ToLower());

                if (user == null)
                {
                    return NotFound("User not found!");
                }

                if (!string.IsNullOrEmpty(updateDto.NewUsername) && updateDto.NewUsername != updateDto.Username.ToLower())
                {
                    // Check if the new username already exists
                    var existingUserWithUsername = await _userManager.FindByNameAsync(updateDto.NewUsername.ToLower());
                    if (existingUserWithUsername != null)
                    {
                        return Conflict("Username already exists.");
                    }

                    // Update the username
                    user.UserName = updateDto.NewUsername.ToLower();
                }

                // Check if the new email is provided and it's different from the current email
                if (!string.IsNullOrEmpty(updateDto.Email) && updateDto.Email != user.Email)
                {
                    // Check if the new email already exists
                    var existingUserWithEmail = await _userManager.FindByEmailAsync(updateDto.Email.ToLower());
                    if (existingUserWithEmail != null)
                    {
                        return Conflict("Email already exists.");
                    }

                    // Update the email
                    user.Email = updateDto.Email.ToLower();
                }

                // Update other user properties
                if (!string.IsNullOrEmpty(updateDto.FirstName))
                {
                    user.FirstName = updateDto.FirstName;
                }

                if (!string.IsNullOrEmpty(updateDto.LastName))
                {
                    user.LastName = updateDto.LastName;
                }

                // Update the user
                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    return BadRequest("Failed to update user");
                }

                return Ok(new Post_NewUserDto
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("PasswordReset")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Find the user by username
                var user = await _userManager.FindByNameAsync(changePasswordDto.Username.ToLower());

                if (user == null)
                {
                    return NotFound("User not found!");
                }

                // Check if the old password is correct
                var checkOldPassword = await _userManager.CheckPasswordAsync(user, changePasswordDto.OldPassword);

                if (!checkOldPassword)
                {
                    return BadRequest("Old password is incorrect");
                }

                // Change the user's password
                var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

                if (!result.Succeeded)
                {
                    // Check for specific error reasons and return appropriate responses
                    foreach (var error in result.Errors)
                    {
                        if (error.Code == "Password Requires Non Alphanumeric")
                        {
                            return BadRequest("The new password must contain non-alphanumeric characters.");
                        }
                        else if (error.Code == "PasswordTooShort")
                        {
                            return BadRequest("The new password is too short.");
                        }
                       
                    }

                    return BadRequest("Failed to change password");
                }

                return Ok("Password changed successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [Authorize]
        [HttpDelete("deleteAccount")]
        public async Task<IActionResult> DeleteAccount(string username)
        {
            try
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == username.ToLower());

                if (user == null) return NotFound("User not found!");

                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded) return BadRequest("Failed to delete user");

                return Ok("Account deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
