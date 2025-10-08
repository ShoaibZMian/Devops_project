
using backend2.Controllers.Interfaces;
using backend2.Data;
using backend2.Models;
using Microsoft.EntityFrameworkCore;

namespace backend2.Controllers.Repository
{
     public class SubCategoryRepository : ISubCategoryRepository
    {
        private readonly ApplicationDB_Context _context;

        public SubCategoryRepository(ApplicationDB_Context context)
        {
            _context = context;
        }

        public async Task<SubCategory> CreateSubCategoryAsync(SubCategory subCategory)
        {
            await _context.SubCategorys.AddAsync(subCategory);
            await _context.SaveChangesAsync();
            return subCategory;
        }

        public async Task<SubCategory?> DeleteSubCategoryAsync(int id)
        {
            var subCategory = await _context.SubCategorys.FindAsync(id);
            if (subCategory == null)
            {
                return null;
            }

            _context.SubCategorys.Remove(subCategory);
            await _context.SaveChangesAsync();
            return subCategory;
        }

        public async Task<IEnumerable<SubCategory>> GetAllSubCategoriesAsync()
        {
            return await _context.SubCategorys
            .Include(c => c.Category)
            .Include(p=>p.Product)
            .ToListAsync();
        }

        public async Task<SubCategory?> GetSubCategoryByIdAsync(int id)
        {
            return await _context.SubCategorys
            .Include(c=>c.Category)
            .Include(p=>p.Product)
            .FirstOrDefaultAsync(p=>p.SubCategoryId == id);
        }

        public async Task<bool?> SubCategoryExists(int id)
        {
            return await _context.SubCategorys
            .Include(c => c.Category)
            .Include(p=>p.Product)
            .AnyAsync(e => e.SubCategoryId == id);
        }

        public Task<SubCategory?> SubCategoryNameExisting(string name)
        {
            var subCategory = _context.SubCategorys.Where(x => x.Name == name).FirstOrDefaultAsync();
            return subCategory;
        }

        public async Task<SubCategory?> UpdateSubCategoryAsync(int id, Put_SubCategoryDto subCategoryDto)
        {
            var existingSubCategory = await _context.SubCategorys.FirstOrDefaultAsync(x => x.SubCategoryId == id);
            if (existingSubCategory is null)
            {
                return null;
            }

            existingSubCategory.Name = subCategoryDto.SubCategoryName;
            

            await _context.SaveChangesAsync();
            return existingSubCategory;
        }

    }
}