
using backend2.Models;

namespace backend2.Controllers.Interfaces
{
    public interface IJWT_TokenService
    {
        Task<string> GenerateJwtToken(User user);
    }
}