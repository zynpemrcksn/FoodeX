namespace FoodeX.API.Models
{
    public class Order
    {
        public int Id { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public OrderStatus Status { get; set; } = OrderStatus.Preparing;
        public string DeliveryAddress { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = string.Empty;

        public string PaymentStatus { get; set; } = "Pending";

        public int UserId { get; set; }

        public User? User { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new();
    }
}