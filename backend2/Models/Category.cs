

using System.ComponentModel.DataAnnotations;

namespace backend2.Models
{
    public class Category
    {
        
        public int CategoryId { get; set; }
        public string? Name { get; set; }
        
        public List<SubCategory>? SubCategory { get; set; } = new List<SubCategory>();
        public List <Product>? Product { get; set; } = new List<Product>();

    }
}