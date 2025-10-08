using backend2.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend2.Controllers.API_EndPoints_Controller;

[Route("api/[controller]")]
[ApiController]
public class HealthController : ControllerBase
{
    private readonly ApplicationDB_Context _context;

    public HealthController(ApplicationDB_Context context)
    {
        _context = context;
    }

    /// <summary>
    /// Basic health check endpoint
    /// </summary>
    /// <returns>API status and timestamp</returns>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            service = "backend2 API",
            timestamp = DateTime.UtcNow,
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
        });
    }

    /// <summary>
    /// Database connection health check
    /// </summary>
    /// <returns>Database connection status</returns>
    [HttpGet("db")]
    public async Task<IActionResult> DatabaseHealth()
    {
        try
        {
            // Try to connect to database
            var canConnect = await _context.Database.CanConnectAsync();

            if (canConnect)
            {
                // Get count of some tables to verify schema exists
                var usersCount = await _context.Users.CountAsync();
                var productsCount = await _context.Products.CountAsync();
                var categoriesCount = await _context.Categories.CountAsync();

                return Ok(new
                {
                    status = "healthy",
                    database = "connected",
                    timestamp = DateTime.UtcNow,
                    stats = new
                    {
                        users = usersCount,
                        products = productsCount,
                        categories = categoriesCount
                    }
                });
            }
            else
            {
                return StatusCode(503, new
                {
                    status = "unhealthy",
                    database = "cannot connect",
                    timestamp = DateTime.UtcNow
                });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(503, new
            {
                status = "unhealthy",
                database = "error",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Simple ping endpoint
    /// </summary>
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok(new
        {
            message = "pong",
            timestamp = DateTime.UtcNow
        });
    }
}
