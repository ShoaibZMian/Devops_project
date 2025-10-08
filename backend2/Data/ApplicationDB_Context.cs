using backend2.Models;
using backend2.Models.Enum;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend2.Data;

public class ApplicationDB_Context : IdentityDbContext<User>
{
    public ApplicationDB_Context(DbContextOptions<ApplicationDB_Context> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<SubCategory> SubCategorys { get; set; }

    public DbSet<Order> Orders { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Rename the default Identity tables
        modelBuilder.HasDefaultSchema("dbo");
        modelBuilder.Entity<User>(e => e.ToTable("Users"));
        modelBuilder.Entity<IdentityRole>(e => e.ToTable("Roles"));
        modelBuilder.Entity<IdentityUserRole<string>>(e => e.ToTable("UserRoles"));
        modelBuilder.Entity<IdentityUserClaim<string>>(e => e.ToTable("UserClaims"));
        modelBuilder.Entity<IdentityUserLogin<string>>(e => e.ToTable("UserLogins"));
        modelBuilder.Entity<IdentityRoleClaim<string>>(e => e.ToTable("RoleClaims"));
        modelBuilder.Entity<IdentityUserToken<string>>(e => e.ToTable("UserTokens"));


        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, Name = "Mend" },
            new Category { CategoryId = 2, Name = "women" },
            new Category { CategoryId = 3, Name = "Children" },
            new Category { CategoryId = 4, Name = "Vitamins" }
        );

        // clothes and vitamins 
        modelBuilder.Entity<SubCategory>().HasData(
            new SubCategory { SubCategoryId = 1, Name = "T-shirt", CategoryId = 1 },
            new SubCategory { SubCategoryId = 2, Name = "Pants", CategoryId = 1 },
            new SubCategory { SubCategoryId = 3, Name = "Dress", CategoryId = 2 },
            new SubCategory { SubCategoryId = 4, Name = "Skirt", CategoryId = 2 },
            new SubCategory { SubCategoryId = 5, Name = "Vitamin", CategoryId = 4 }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                ProductId = "vitamin-a-10000-100", Name = "Vitamin A, 10000 IU, 100 tablets", Price = 75,
                Currency = CurrencyType.DKK, RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null,
                SubcategoryId = 5, CategoryId = 4
            },
            new Product
            {
                ProductId = "vitamin-b-100-100", Name = "Vitamin B, 100 mg, 100 tablets", Price = 50,
                Currency = CurrencyType.DKK, RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null,
                SubcategoryId = 5, CategoryId = 4
            },
            new Product
            {
                ProductId = "vitamin-c-1000-100", Name = "Vitamin C, 1000 mg, 100 tablets", Price = 100,
                Currency = CurrencyType.DKK, RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null,
                SubcategoryId = 5, CategoryId = 4
            },
            new Product
            {
                ProductId = "vitamin-d-1000-100", Name = "Vitamin D, 1000 IU, 100 tablets", Price = 125,
                Currency = CurrencyType.DKK, RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null,
                SubcategoryId = 5, CategoryId = 4
            },
            new Product
            {
                ProductId = "t-shirt1", Name = "T-shirt, white, size M", Price = 100, Currency = CurrencyType.DKK,
                RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null, SubcategoryId = 1, CategoryId = 1
            },
            new Product
            {
                ProductId = "t-shirt2", Name = "T-shirt, black, size L", Price = 100, Currency = CurrencyType.DKK,
                RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null, SubcategoryId = 1, CategoryId = 1
            },
            new Product
            {
                ProductId = "pants1", Name = "Pants, blue, size 32", Price = 200, Currency = CurrencyType.DKK,
                RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null, SubcategoryId = 2, CategoryId = 1
            },
            new Product
            {
                ProductId = "pants2", Name = "Pants, black, size 34", Price = 200, Currency = CurrencyType.DKK,
                RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null, SubcategoryId = 2, CategoryId = 1
            },
            new Product
            {
                ProductId = "dress1", Name = "Dress, red, size M", Price = 300, Currency = CurrencyType.DKK,
                RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null, SubcategoryId = 3, CategoryId = 2
            },
            new Product
            {
                ProductId = "dress2", Name = "Dress, green, size L", Price = 300, Currency = CurrencyType.DKK,
                RebateQuantity = 2, RebatePercent = 10, UpsellProductId = null, SubcategoryId = 3, CategoryId = 2
            }
        );


        var roles = new List<IdentityRole>
        {
            new()
            {
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new()
            {
                Name = "User",
                NormalizedName = "USER"
            }
        };
        modelBuilder.Entity<IdentityRole>().HasData(roles);

      
    }
}