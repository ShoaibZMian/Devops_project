using System.ComponentModel.DataAnnotations.Schema;
using backend2.Models.Enum;

namespace backend2.Models;

public class Product
{
    public string? ProductId { get; set; }
    public string? Name { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal Price { get; set; }

    public CurrencyType? Currency { get; set; }
    public int RebateQuantity { get; set; }
    public int RebatePercent { get; set; }
    public string? UpsellProductId { get; set; }
    public string? FileName { get; set; }
    public string? ContentType { get; set; }
    public string? Path { get; set; }
    public int? SubcategoryId { get; set; }
    public SubCategory? Subcategory { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; } // Navigation property

   
    
}