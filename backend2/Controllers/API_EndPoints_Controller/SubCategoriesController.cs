using backend2.Controllers.Interfaces;
using backend2.Database.Data_transfer_object.Dtos;
using backend2.Database.Data_transfer_object.Request.SubCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend2.Controllers.API_EndPoints_Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCategoriesController : ControllerBase
    {
        private readonly ISubCategoryRepository _subCategoryRepository;

        public SubCategoriesController(ISubCategoryRepository subCategoryRepository)
        {
            _subCategoryRepository = subCategoryRepository;
        }

        [HttpGet ("GetSubCategories")]
        public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetAllSubCategories()
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var subCategories = await _subCategoryRepository.GetAllSubCategoriesAsync();
            var subCategoryDtos = subCategories.Select(subCategory => subCategory.ToSubCategoryDto());
            return Ok(subCategoryDtos);
        }

        [HttpGet("SubCategoryName/{name}")]
        public async Task<ActionResult<SubCategoryDto>> SubCategoryNameExisting([FromRoute] string name)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var existingSubCategory = await _subCategoryRepository.SubCategoryNameExisting(name);
                if (existingSubCategory == null)
                {
                    return NotFound();
                }
                return existingSubCategory.ToSubCategoryDto();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while checking sub-category name existence: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("GetSubCategory/{id}")]
        public async Task<ActionResult<SubCategoryDto>> GetSubCategoryById([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var subCategory = await _subCategoryRepository.GetSubCategoryByIdAsync(id);
                if (subCategory == null)
                {
                    return NotFound( "Sub-category not found."); 
                }

                return subCategory.ToSubCategoryDto();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the sub-category: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("CreateSubCategory")]
        public async Task<ActionResult<SubCategoryDto>> CreateSubCategory([FromBody] Post_SubCategoryDto subCategoryDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                
                var existingSubCategory = await _subCategoryRepository.SubCategoryNameExisting(subCategoryDto.SubCategoryName);
                if (existingSubCategory != null)
                {
                    return Conflict("Sub-category with the same name already exists.");
                }
                var subCategory = subCategoryDto.ToSubCategoryFromPostDto();
                await _subCategoryRepository.CreateSubCategoryAsync(subCategory);

                return CreatedAtAction(nameof(GetSubCategoryById), new { id = subCategory.SubCategoryId }, subCategory.ToSubCategoryDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating the sub-category: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateSubCategory/{id}")]
        public async Task<IActionResult> UpdateSubCategory([FromRoute] int id, [FromBody] Put_SubCategoryDto subCategoryDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                
                var existingSubCategory = await _subCategoryRepository.SubCategoryNameExisting(subCategoryDto.SubCategoryName);
                if (existingSubCategory != null && existingSubCategory.SubCategoryId != id)
                {
                    return Conflict("Sub-category with the same name already exists.");
                }

                var updatedSubCategory = await _subCategoryRepository.UpdateSubCategoryAsync(id, subCategoryDto);
                if (updatedSubCategory == null)
                {
                    return NotFound();
                }
                return Ok(updatedSubCategory.ToSubCategoryDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the sub-category: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteSubCategory/{id}")]
        public async Task<IActionResult> DeleteSubCategory(int id)
        {
            var deletedSubCategory = await _subCategoryRepository.DeleteSubCategoryAsync(id);
            if (deletedSubCategory == null)
            {
                return NotFound( "Sub-category not found.");
            }
            return Ok(deletedSubCategory);
        }
    }
}
