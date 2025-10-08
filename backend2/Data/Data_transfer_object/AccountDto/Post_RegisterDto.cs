
using System.ComponentModel.DataAnnotations;


namespace backend2.Data.Data_transfer_object.AccountDto
{
    public class Post_RegisterDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        [Required]
        public string? Username { get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
    }
}