namespace FoodeX.API.Models
{
    public class Restaurant
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Logo { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public double Rating { get; set; }

        public string Description { get; set; } = string.Empty;

        public List<Product> Products { get; set; } = new List<Product>();

        public List<Review> Reviews { get; set; } = new();
        public string ImageUrl { get; set; } = string.Empty;
    }
}