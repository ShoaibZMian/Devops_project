
using Microsoft.AspNetCore.Identity;

namespace backend2.Models
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; } 

     
      
    
        
    }
}