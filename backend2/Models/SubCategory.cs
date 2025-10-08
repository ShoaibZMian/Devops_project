
namespace backend2.Models
{
  
    public class SubCategory
    {
    
    public int SubCategoryId { get; set; }
    public string? Name { get; set; }

    
    public int? CategoryId { get; set; } // This is the foreign key
    public Category? Category { get; set; } // This is the navigation property
    
    public List<Product>? Product { get; set; } = new List<Product>();
        
    }
}