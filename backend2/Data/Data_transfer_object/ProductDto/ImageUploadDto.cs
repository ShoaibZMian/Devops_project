

using System.ComponentModel.DataAnnotations;

namespace backend2.Data.Data_transfer_object.ProductDto
{
    public class ImageUploadDto
    {
        public string? Base64Image { get; set; }
        
        [Required(ErrorMessage = "you must upload a file name")]
        public string? FileName { get; set; }

        [Required(ErrorMessage = "you must upload a content type")]
        [RegularExpression(@"^image\/(png|jpg|jpeg)$",
            ErrorMessage = "File must be of type png, jpg or jpeg")]
        public string? ContentType { get; set; }

        public string? ProductId { get; set; }
    }
}