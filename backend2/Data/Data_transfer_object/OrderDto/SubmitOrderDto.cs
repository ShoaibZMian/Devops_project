using System.ComponentModel.DataAnnotations;
using backend2.Models;

namespace backend2.Data.Data_transfer_object.OrderDto;

public class SubmitOrderDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name should be between 1 and 100 characters")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "City is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "City should be between 1 and 100 characters")]
    public string? City { get; set; }

    [Required(ErrorMessage = "Zip code is required")]
    [Range(1, int.MaxValue)]
    public string? ZipCode { get; set; }

    [Required(ErrorMessage = "Address is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Address should be between 1 and 100 characters")]
    public string? Address { get; set; }

    [Required(ErrorMessage = "Phone is required")]
    [StringLength(20, MinimumLength = 1, ErrorMessage = "Phone should be between 1 and 20 characters")]
    //[Phone] but this should not be used because there are different phone number formats
    public string? Phone { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Email should be between 1 and 100 characters")]
    [EmailAddress]
    public string? Email { get; set; }

    [Required(ErrorMessage = "You must select a product")]
    public List<Product>? Products { get; set; }

    public string? Company { get; set; }
    public string? Country { get; set; }

    public string? VatNumber { get; set; }
}