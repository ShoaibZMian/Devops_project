

namespace backend2.Controllers.Helpers
{
    public class ProductQueryObjects
    {
    public string? ProductName { get; set; } = null;
    public string? Category { get; set; }= null;
    public decimal? MinPrice { get; set; }= null;
    public decimal? MaxPrice { get; set; }= null;
    public string? Keywords { get; set; }= null;
    public string? SortBy { get; set; }= null;
    public bool? IsDecending { get; set; }= false;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;

    }
}