

namespace backend2.Controller.Helpers
{
    public class ImageUpload
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public ImageUpload(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<string> UploadFile(IFormFile file)
        {
            string fileName = null;
            if (file.Length > 0)
            {
                string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "products");
                fileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                string filePath = Path.Combine(uploadsFolder, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
            return fileName;
        }
    }
}