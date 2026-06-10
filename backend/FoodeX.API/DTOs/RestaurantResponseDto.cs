namespace FoodeX.API.DTOs
{
    public class RestaurantResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Logo { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public double Rating { get; set; }
public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public List<ProductResponseDto> Products { get; set; } = new List<ProductResponseDto>();
    }
}