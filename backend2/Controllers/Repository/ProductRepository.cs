
using System.Text;
using backend2.Controllers.Helpers;
using backend2.Controllers.Interfaces;
using backend2.Data;
using backend2.Data.Data_transfer_object.ProductDto;
using backend2.Models;
using Microsoft.EntityFrameworkCore;

namespace backend2.Controller.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDB_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductRepository(ApplicationDB_Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> DeleteProductAsync(string id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return null;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return product;
        }


        public async Task<Product?> GetProductByIdAsync(string id)
        {
            return await _context.Products
            // .Include(c => c.ProductReviews)
            // .Include(c => c.WishLists)
            // .Include(c => c.ProductImages)
            .FirstOrDefaultAsync(i => i.ProductId == id);
        }

        public async Task<Product?> UpdateProductAsync(string id, Put_ProductDto productDto)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == id);
            if (existingProduct is null)
            {
                return null;
            }
            existingProduct.ProductId = productDto.ProductId;
            existingProduct.Name = productDto.Name;
            existingProduct.Price = productDto.Price;
            existingProduct.Currency = productDto.Currency;
            existingProduct.RebateQuantity = productDto.RebateQuantity;
            existingProduct.RebatePercent = productDto.RebatePercent;
            existingProduct.UpsellProductId = productDto.UpsellProductId;
            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync(ProductQueryObjects productQuery)
        {
            var products = _context.Products
            // .Include(c => c.ProductReviews)
            // .Include(c => c.WishLists)
            // .Include(c => c.ProductImages)
            .AsQueryable();


            if (!string.IsNullOrWhiteSpace(productQuery.ProductName))
            {
                products = products.Where(c => c.Name.Contains(productQuery.ProductName));
            }

            if (!string.IsNullOrWhiteSpace(productQuery.Category))
            {
                // Assuming you have a navigation property to the Category entity in your Product model
                products = products.Where(p => p.Category.Name.Contains(productQuery.Category));
            }

            if (productQuery.MinPrice.HasValue)
            {
                products = products.Where(p => p.Price >= productQuery.MinPrice.Value);
            }

            if (productQuery.MaxPrice.HasValue)
            {
                products = products.Where(p => p.Price <= productQuery.MaxPrice.Value);
            }


            if (!string.IsNullOrWhiteSpace(productQuery.Keywords))
            {
                products = products
                .Where(p => p.Name.Contains(productQuery.Keywords) 
                          // ||p.Description.Contains(productQuery.Keywords)
                );
            }

            if (!string.IsNullOrWhiteSpace(productQuery.SortBy))
            {
                if (string.Equals(productQuery.SortBy, "price", StringComparison.OrdinalIgnoreCase))
                {
                    products = productQuery.IsDecending.HasValue && productQuery.IsDecending.Value ?
                    products.OrderByDescending(s => s.Price) :
                    products.OrderBy(s => s.Price);
                }

                if (string.Equals(productQuery.SortBy, "rebateQuantity", StringComparison.OrdinalIgnoreCase))
                {
                    products = productQuery.IsDecending.HasValue && productQuery.IsDecending.Value ?
                    products.OrderByDescending(s => s.RebateQuantity) :
                    products.OrderBy(s => s.RebateQuantity);
                }
                if (string.Equals(productQuery.SortBy, "rebatePercent", StringComparison.OrdinalIgnoreCase))
                {
                    products = productQuery.IsDecending.HasValue && productQuery.IsDecending.Value ?
                    products.OrderByDescending(s => s.RebatePercent) :
                    products.OrderBy(s => s.RebatePercent);
                }

                else if (string.Equals(productQuery.SortBy, "name", StringComparison.OrdinalIgnoreCase))
                {
                    products = productQuery.IsDecending.HasValue && productQuery.IsDecending.Value ?
                    products.OrderByDescending(s => s.Name) :
                    products.OrderBy(s => s.Name);
                }

            }

            var skipNumber = (productQuery.PageNumber - 1) * productQuery.PageSize;

            return await products.Skip(skipNumber).Take(productQuery.PageSize).ToListAsync();
        }

        public async Task<bool> ProductExists(string id)
        {
            return await _context.Products.AnyAsync(e => e.ProductId == id);
        }

     
        


    }
}
