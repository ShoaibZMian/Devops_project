using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend2.Controllers.Interfaces;
using backend2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace backend2.Service
{
    public class JWT_TokenService : IJWT_TokenService
    {
        private readonly IConfiguration _settings;
        private readonly SymmetricSecurityKey _symmetricKey;
        private readonly UserManager<User> _userManager;

        public JWT_TokenService(IConfiguration settings, UserManager<User> userManager)
        {
            _settings = settings;
            _userManager = userManager;
            _symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings["JWT:OnlineStoreGroupe24"]));
        }

        public async Task<string> GenerateJwtToken(User appUser)
        {
            Console.WriteLine("Generating JWT token for user: " + appUser.UserName);

            var token = await CreateJwtToken(appUser);

            Console.WriteLine("JWT token generated successfully.");

            return token;
        }

        private async Task<string> CreateJwtToken(User appUser)
        {
            Console.WriteLine("Creating JWT token for user: " + appUser.UserName);

            var tokenDescriptor = await GetTokenDescriptor(appUser);
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            Console.WriteLine("JWT token created successfully.");

            return tokenHandler.WriteToken(token);
        }

        private async Task<SecurityTokenDescriptor> GetTokenDescriptor(User appUser)
        {
            var claims = await GetUserClaims(appUser);
            var signingCredentials = new SigningCredentials(_symmetricKey, SecurityAlgorithms.HmacSha512Signature);

            Console.WriteLine("Generating token descriptor...");
            Console.WriteLine("Claims: " + string.Join(", ", claims.Select(c => $"{c.Type}: {c.Value}")));
            Console.WriteLine("Expires: " + DateTime.Now.AddDays(7));
            Console.WriteLine("Issuer: " + _settings["JWT:Issuer"]);
            Console.WriteLine("Audience: " + _settings["JWT:Audience"]);

            return new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = signingCredentials,
                Issuer = _settings["JWT:Issuer"],
                Audience = _settings["JWT:Audience"]
            };
        }

        private async Task<List<Claim>> GetUserClaims(User appUser)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, appUser.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, appUser.UserName)
            };

            // Fetch actual user roles from database
            var userRoles = await _userManager.GetRolesAsync(appUser);

            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
                Console.WriteLine($"Added {role} role claim.");
            }

            return claims;
        }
    }
}