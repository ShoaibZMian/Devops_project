namespace backend2.Models;

public class Order
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? City { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Company { get; set; }

    public string? VatNumber { get; set; }

    public string? ZipCode { get; set; }

    public string? OrderId { get; set; }
    
    public string? Country { get; set; }

    /* relationship properties */

    public ICollection<Product>? Products { get; set; }
}