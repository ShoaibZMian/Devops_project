
using System.Text;
using backend2.Controller.Helpers;
using backend2.Controllers.Helpers;
using backend2.Controllers.Interfaces;
using backend2.Data;
using backend2.Data.Data_transfer_object.Dtos;
using backend2.Data.Data_transfer_object.ProductDto;
using backend2.Data.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ApplicationDB_Context _databaseContext;

        public ProductsController(IProductRepository productRepository , IWebHostEnvironment webHostEnvironment, ApplicationDB_Context databaseContext)
        {
            _productRepository = productRepository;
            _webHostEnvironment = webHostEnvironment;
            _databaseContext = databaseContext;
        }

        [HttpGet("GetProducts")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts([FromQuery] ProductQueryObjects productQuery)
        {
             if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var products = await _productRepository.GetAllProductsAsync(productQuery);
            var productDtos = products.Select(product => product.ToProductDto());
            return Ok(productDtos);
        }

        [HttpGet("GetProduct/{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById([FromRoute] string id)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
            
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Invalid product ID.");
                }

                var product = await _productRepository.GetProductByIdAsync(id);

                if (product == null)
                {
                    return NotFound("Product not found.");
                }

                return product.ToProductDto();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }



        // [Authorize(Roles = "Admin")]
        [HttpPost("CreateProduct")]
        public async Task<ActionResult<ProductDto>> CreateProduct(  [FromForm] Post_ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var product = productDto.ToProductFromPostDto();

                await _productRepository.CreateProductAsync( product);

                return CreatedAtAction(nameof(GetProductById), new { id = product.ProductId }, product.ToProductDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateProduct/{id}")]
        public async Task<IActionResult> UpdateProduct([FromRoute] string id, [FromBody] Put_ProductDto productDto)
        {
            try
            {
               
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Invalid product ID.");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedProduct = await _productRepository.UpdateProductAsync(id, productDto);

                if (updatedProduct == null)
                {
                    return NotFound("Product not found.");
                }

                return Ok(updatedProduct.ToProductDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [Authorize(Roles="Admin")]
        [HttpDelete("DeleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
             if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var deletedProduct = await _productRepository.DeleteProductAsync(id);
            if (deletedProduct == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPost("UploadImage")]
        public async Task<ActionResult<string>> UploadImage([FromBody] ImageUploadDto imageUploadDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var fileBytes = Convert.FromBase64String(imageUploadDto.Base64Image);

            var path = Path.Combine(_webHostEnvironment.WebRootPath, "Images", "products",
                new StringBuilder().Append(Guid.NewGuid()).Append(Path.GetExtension(imageUploadDto.FileName)).ToString());

            // Write all bytes to the file
            await System.IO.File.WriteAllBytesAsync(path, fileBytes);

            // Find the product and update its ImagePath
            var product = await _databaseContext.Products.FindAsync(imageUploadDto.ProductId);
            if (product != null)
            {
                product.Path = path;
                product.FileName = imageUploadDto.FileName;
                product.ContentType = "image/jpeg/png/jpg";
                _databaseContext.Entry(product).State = EntityState.Modified;
                await _databaseContext.SaveChangesAsync();
            }
            // Map the updated product to a ProductDto
            var productDto = product.ToProductDto();
            // Return the path
            return Ok(productDto);
        }


        [HttpGet("GetImage/{productId}")]
        public async Task<IActionResult> GetImageByProductId(string productId)
        {
            var product = await _databaseContext.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound();
            }

            var image = System.IO.File.OpenRead(product.Path);
            return File(image, product.ContentType);
        }

    }
}
