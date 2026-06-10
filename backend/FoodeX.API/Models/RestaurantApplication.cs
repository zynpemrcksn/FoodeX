namespace FoodeX.API.Models
{
    public class RestaurantApplication
    {
        public int Id { get; set; }

        public string RestaurantName { get; set; } = string.Empty;

        public string OwnerFullName { get; set; } = string.Empty;

        public string OwnerEmail { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string CuisineType { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string LogoUrl { get; set; } = string.Empty;
    }
}