

using backend2.Data.Mapper;
using backend2.Database.Data_transfer_object.Dtos;
using backend2.Database.Data_transfer_object.Request.Category;
using backend2.Models;

namespace backend2.Database.Mapper
{
    public static class CategoryMapper
    {
        public static CategoryDto ToCategoryDto(this Category category)
        {
            return new CategoryDto
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                SubCategory = category.SubCategory?.Select(s => s.ToSubCategoryDto()).ToList(),
                Product = category.Product?.Select(p => p.ToProductDto()).ToList()
                
            };
        }

        public static Category ToCategoryFromPostDto(this Post_CategoryDto categoryDto)
        {
            return new Category
            {
                Name = categoryDto.CategoryName,
               
            };
        }

        public static Category ToCategoryFromPutDto(this Put_CategoryDto putCategoryDto)
        {
            return new Category
            {
                
                Name = putCategoryDto.CategoryName,
                
            };
        }
    }
}