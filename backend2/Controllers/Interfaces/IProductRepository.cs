


using backend2.Controllers.Helpers;
using backend2.Data.Data_transfer_object.ProductDto;
using backend2.Models;

namespace backend2.Controllers.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync(ProductQueryObjects productQuery);
        Task<Product?> GetProductByIdAsync(string id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product?> UpdateProductAsync(string id, Put_ProductDto productDto);
        Task<Product?> DeleteProductAsync(string id);
     
        Task<bool> ProductExists(string id);
    }
}