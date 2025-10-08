
using backend2.Controllers.Interfaces;
using backend2.Database.Data_transfer_object.Dtos;
using backend2.Database.Data_transfer_object.Request.Category;
using backend2.Database.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend2.Controllers.API_EndPoints_Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
       private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }


        [HttpGet("GetCategories")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAllCategories()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var categories = await _categoryRepository.GetAllCategoriesAsync();

                if (categories == null || !categories.Any())
                {
                    return NotFound("No categories found.");
                }

                var categoryDtos = categories.Select(category => category.ToCategoryDto());
                return Ok(categoryDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching categories: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("GetCategory/{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryById([FromRoute] int id)
        {
            try
            {
                var category = await _categoryRepository.GetCategoryByIdAsync(id);

                if (category == null)
                {
                    return NotFound( "Category not found.");
                }

                return category.ToCategoryDto();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching category: {ex.Message}");
            }
        }

        [HttpGet("CategoryName/{name}")]
        public async Task<ActionResult<CategoryDto>> CategoryNameExisting([FromRoute] string name)
        {
            try
            {
                var category = await _categoryRepository.CategoryNameExisting(name);

                if (category == null)
                {
                    return NotFound( "Category name does not exist.");
                }

                return category.ToCategoryDto();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while checking category name existence: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("CreateCategory")]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] Post_CategoryDto categoryDto)
        {
            try
            {
                var existingCategory = await _categoryRepository.CategoryNameExisting(categoryDto.CategoryName);
                if (existingCategory != null)
                {
                    return Conflict("Category with the same name already exists.");
                }

                var category = categoryDto.ToCategoryFromPostDto();
                await _categoryRepository.CreateCategoryAsync(category);
                return CreatedAtAction(nameof(GetCategoryById), new { id = category.CategoryId }, category.ToCategoryDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the category: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateCategory/{id}")]
        public async Task<IActionResult> UpdateCategory([FromRoute] int id, [FromBody] Put_CategoryDto categoryDto)
        {
            try
            {
                // Check if a category with the same name already exists (excluding the current category being updated)
                var existingCategory = await _categoryRepository.CategoryNameExisting(categoryDto.CategoryName);
                if (existingCategory != null && existingCategory.CategoryId != id)
                {
                    return Conflict("Category with the same name already exists.");
                }

                var updatedCategory = await _categoryRepository.UpdateCategoryAsync(id, categoryDto);
                if (updatedCategory == null)
                {
                    return NotFound( "Category not found.");
                }
                return Ok(updatedCategory.ToCategoryDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the category: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var deletedCategory = await _categoryRepository.DeleteCategoryAsync(id);
            if (deletedCategory == null)
            {
                return NotFound( "Category not found.");
            }
            return Ok(deletedCategory ) ;
            
        }

    }
}
