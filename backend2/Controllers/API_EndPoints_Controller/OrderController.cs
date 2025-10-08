using backend2.Data;
using backend2.Data.Data_transfer_object.OrderDto;
using backend2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend2.Controller.API_EndPoints_Controller;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly ApplicationDB_Context _context;

    public OrderController(ApplicationDB_Context Context)
    {
        _context = Context;
    }
    [HttpPost("/orderSubmit")]
    public async Task<IActionResult> SubmitOrder([FromBody] SubmitOrderDto submitOrderDto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var totalOrders = await _context.Orders.CountAsync();

            var order = new Order
            {
                Name = submitOrderDto.Name,
                City = submitOrderDto.City,
                Address = submitOrderDto.Address,
                Phone = submitOrderDto.Phone,
                Email = submitOrderDto.Email,
                Company = submitOrderDto.Company,
                VatNumber = submitOrderDto.VatNumber,
                Products = submitOrderDto.Products,
                ZipCode = submitOrderDto.ZipCode,
                Country = submitOrderDto.Country,
                OrderId = $"order-{totalOrders + 1}"
            };

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            return StatusCode(200, "Order submitted successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while submitting order: {ex.Message}");
        }
    }
}