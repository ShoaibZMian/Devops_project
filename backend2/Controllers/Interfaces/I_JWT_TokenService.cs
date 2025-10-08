
using backend2.Models;

namespace backend2.Controllers.Interfaces
{
    public interface IJWT_TokenService
    {
        string GenerateJwtToken(User user);
    }
}