namespace FoodeX.API.DTOs
{
    public class ProductResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        public int Stock { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public int RestaurantId { get; set; }

        public string RestaurantName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
}