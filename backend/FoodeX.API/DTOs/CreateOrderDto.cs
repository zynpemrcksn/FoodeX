using System.ComponentModel.DataAnnotations;

namespace FoodeX.API.DTOs
{
    public class CreateOrderDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public string DeliveryAddress { get; set; } = string.Empty;

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        public List<CreateOrderItemDto> Items { get; set; } = new();
        public string Category { get; set; } = string.Empty;
    }

    public class CreateOrderItemDto
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}