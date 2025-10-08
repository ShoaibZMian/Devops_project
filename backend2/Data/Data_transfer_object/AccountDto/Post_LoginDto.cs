
using System.ComponentModel.DataAnnotations;


namespace backend2.Data.Data_transfer_object
{
    public class Post_LoginDto
    {
     
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        
       
    }
}