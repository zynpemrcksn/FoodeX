namespace FoodeX.API.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "customer";

        public string PhoneNumber { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public int? RestaurantId { get; set; }

        public Restaurant? Restaurant { get; set; }

        public List<Review> Reviews { get; set; } = new();

        public bool MustChangePassword { get; set; } = false;
    }
}