namespace FoodeX.API.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        public int Stock { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public int RestaurantId { get; set; }

        public Restaurant? Restaurant { get; set; }
        public string Category { get; set; } = string.Empty;
    }
}