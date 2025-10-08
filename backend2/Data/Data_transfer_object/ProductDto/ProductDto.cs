
using System.ComponentModel.DataAnnotations;

using backend2.Models.Enum;

namespace backend2.Data.Data_transfer_object.Dtos
{
    public class ProductDto
    {
        public string? ProductId { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        public CurrencyType? Currency { get; set; } = CurrencyType.DKK;
        public int RebateQuantity { get; set; }
        public int RebatePercent { get; set; }
        public string? UpsellProductId { get; set; }

        [Required(ErrorMessage = "you must upload a file")]
        public byte[]? File { get; set; }

        [Required(ErrorMessage = "you must upload a file name")]
        public string? FileName { get; set; }

        [Required(ErrorMessage = "you must upload a content type")]
        [RegularExpression(@"^image\/(png|jpg|jpeg)$",
            ErrorMessage = "File must be of type png, jpg or jpeg")]
        public string? ContentType { get; set; }
        public string? Path { get; set; }

        public int? SubcategoryId { get; set; }
    
        public int CategoryId { get; set; }

       
        //Add review list 
    }
}