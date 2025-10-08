

using System.ComponentModel.DataAnnotations;

namespace backend2.Database.Data_transfer_object.Request.SubCategory
{
    public class Post_SubCategoryDto
    {
        [Required]
        [StringLength(255)]
        public string? SubCategoryName { get; set; }

        [Required]
        public int CategoryId { get; set; }

    }
}