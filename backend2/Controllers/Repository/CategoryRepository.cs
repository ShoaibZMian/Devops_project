

using backend2.Controllers.Interfaces;
using backend2.Data;
using backend2.Database.Data_transfer_object.Request.Category;
using backend2.Models;
using Microsoft.EntityFrameworkCore;

namespace backend2.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDB_Context _context;

        public CategoryRepository(ApplicationDB_Context context)
        {
            _context = context;
        }

        public Task<Category?> CategoryNameExisting(string name)
        {
            var category = _context.Categories
            .Include (s=>s.SubCategory)
            .Include(p=>p.Product)
            
            .FirstOrDefaultAsync(x => x.Name == name);
            return category;
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return null;
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories
            .Include(s=>s.SubCategory)
            .Include(p=>p.Product)
            .ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
            .Include(s=> s.SubCategory)
            .Include(p=>p.Product)
            .FirstOrDefaultAsync(x => x.CategoryId == id);
        }


        public async Task<Category?> UpdateCategoryAsync(int id, Put_CategoryDto categoryDto)
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(x => x.CategoryId == id);
            if (existingCategory is null)
            {
                return null;
            }

            existingCategory.Name = categoryDto.CategoryName;
          
            await _context.SaveChangesAsync();
            return existingCategory;
        }
    }
}
