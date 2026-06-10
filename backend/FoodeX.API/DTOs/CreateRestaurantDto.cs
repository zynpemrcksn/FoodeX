using System.ComponentModel.DataAnnotations;

namespace FoodeX.API.DTOs
{
    public class CreateRestaurantDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Logo { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;

        [Range(0, 5)]
        public double Rating { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}