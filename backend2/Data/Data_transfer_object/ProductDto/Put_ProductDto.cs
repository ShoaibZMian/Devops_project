

using System.ComponentModel.DataAnnotations;
using backend2.Models.Enum;

namespace backend2.Data.Data_transfer_object.ProductDto
{
    public class Put_ProductDto
    {
        public string? ProductId { get; set; }
        public string? Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        public CurrencyType Currency { get; set; } = CurrencyType.DKK;
        public int RebateQuantity { get; set; }
        public int RebatePercent { get; set; }
        public string? UpsellProductId { get; set; }
        public byte[]? File { get; set; }
        public string? FileName { get; set; }
    }
}