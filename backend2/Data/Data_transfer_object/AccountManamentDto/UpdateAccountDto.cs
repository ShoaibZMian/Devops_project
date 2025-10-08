

using System.ComponentModel.DataAnnotations;

namespace backend2.Data.Data_transfer_object.AccountManamentDto
{
    public class UpdateAccountDto
    {

        public string? Username { get; set; }
        public string? NewUsername { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
}