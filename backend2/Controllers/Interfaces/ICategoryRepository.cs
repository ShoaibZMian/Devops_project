
using backend2.Database.Data_transfer_object.Request.Category;
using backend2.Models;

namespace backend2.Controllers.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category> CreateCategoryAsync(Category category);
        Task<Category?> UpdateCategoryAsync(int id, Put_CategoryDto categoryDto);
        Task<Category?> DeleteCategoryAsync(int id);
        Task<Category?> CategoryNameExisting(string name);
    }
}