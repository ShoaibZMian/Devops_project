

using System.ComponentModel.DataAnnotations;
using backend2.Models.Enum;

namespace backend2.Data.Data_transfer_object.ProductDto
{
    public class Post_ProductDto
    {
        // public string? ProductId { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        public CurrencyType Currency { get; set; } = CurrencyType.DKK;
        public int RebateQuantity { get; set; }
        public int RebatePercent { get; set; }
        public string? UpsellProductId { get; set; }

        public string? ImageUrl { get; set; }
        // public string? FileName { get; set; }
        // public string? ContentType { get; set; }
        // public string? Path { get; set; }
        public int SubcategoryId { get; set; }
        public int CategoryId { get; set; }
    }
}