using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend2.Controllers.Interfaces;
using backend2.Models;
using Microsoft.IdentityModel.Tokens;

namespace backend2.Service
{
    public class JWT_TokenService : IJWT_TokenService
    {
        private readonly IConfiguration _settings;
        private readonly SymmetricSecurityKey _symmetricKey;

        public JWT_TokenService(IConfiguration settings)
        {
            _settings = settings;
            _symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings["JWT:OnlineStoreGroupe24"]));
        }

        public string GenerateJwtToken(User appUser)
        {
            Console.WriteLine("Generating JWT token for user: " + appUser.UserName);

            var token = CreateJwtToken(appUser);

            Console.WriteLine("JWT token generated successfully.");

            return token;
        }

        private string CreateJwtToken(User appUser)
        {
            Console.WriteLine("Creating JWT token for user: " + appUser.UserName);

            var tokenDescriptor = GetTokenDescriptor(appUser);
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            Console.WriteLine("JWT token created successfully.");

            return tokenHandler.WriteToken(token);
        }

     private SecurityTokenDescriptor GetTokenDescriptor(User appUser)
{
    var claims = GetUserClaims(appUser);
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

        private List<Claim> GetUserClaims(User appUser)
        {
            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Email, appUser.Email),
        new Claim(JwtRegisteredClaimNames.GivenName, appUser.UserName)
        
    };
            var userRole = "Admin";
            claims.Add(new Claim(ClaimTypes.Role, userRole));
            Console.WriteLine($"Added {userRole} role claim.");
            return claims;
        }



    }
}