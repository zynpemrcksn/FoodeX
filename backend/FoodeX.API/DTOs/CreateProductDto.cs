using System.ComponentModel.DataAnnotations;

namespace FoodeX.API.DTOs
{
    public class CreateProductDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.1, 10000)]
        public decimal Price { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Range(0, 10000)]
        public int Stock { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public int RestaurantId { get; set; }
        public string Category { get; set; } = string.Empty;
        
    }
}