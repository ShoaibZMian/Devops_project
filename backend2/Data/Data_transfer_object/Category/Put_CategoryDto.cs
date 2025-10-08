
using System.ComponentModel.DataAnnotations;

using backend2.Database.Data_transfer_object.Dtos;

namespace backend2.Database.Data_transfer_object.Request.Category
{
    public class Put_CategoryDto
    {
    
        [Required(ErrorMessage = "Category Name is required")]
        public string? CategoryName { get; set; }


    }
}