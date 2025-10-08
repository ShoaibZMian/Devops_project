
using System.ComponentModel.DataAnnotations;
using backend2.Data.Data_transfer_object.Dtos;
using backend2.Data.Data_transfer_object.ProductDto;

namespace backend2.Database.Data_transfer_object.Dtos
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        [Required(ErrorMessage = "Category Name is required")]
        public string? Name { get; set; }
        
        public List<SubCategoryDto>? SubCategory { get; set; } = new List<SubCategoryDto>();
        public List<ProductDto>? Product { get; set; } = new List<ProductDto>();
    }
}