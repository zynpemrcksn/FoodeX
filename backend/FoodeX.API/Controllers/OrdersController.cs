using FoodeX.API.Data;
using FoodeX.API.DTOs;
using FoodeX.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            var productIds = dto.Items
                .Select(i => i.ProductId)
                .ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            decimal totalPrice = 0;

            var orderItems = new List<OrderItem>();

            foreach (var item in dto.Items)
            {
                var product = products
                    .FirstOrDefault(p => p.Id == item.ProductId);

                if (product == null)
                {
                    return BadRequest("Product not found.");
                }

                if (product.Stock < item.Quantity)
                {
                    return BadRequest($"{product.Name} does not have enough stock.");
                }

                product.Stock -= item.Quantity;

                totalPrice += product.Price * item.Quantity;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    Price = product.Price
                });
            }

            var order = new Order
            {
                UserId = dto.UserId,
                TotalPrice = totalPrice,
                DeliveryAddress = dto.DeliveryAddress,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Paid",
                OrderItems = orderItems
            };

            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                order.Id,
                order.UserId,
                order.TotalPrice,
                order.Status,
                order.CreatedAt,
                Items = order.OrderItems.Select(item => new
                {
                    item.ProductId,
                    item.Quantity,
                    item.Price
                })
            });
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.TotalPrice,
                    o.Status,
                    o.CreatedAt,

                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        ProductName = oi.Product!.Name,
                        oi.Quantity,
                        oi.Price
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.Id == id)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    RestaurantId = o.OrderItems
                        .Select(oi => oi.Product!.RestaurantId)
                        .FirstOrDefault(),
                    o.TotalPrice,
                    o.Status,
                    o.CreatedAt,
                    o.DeliveryAddress,
                    o.PaymentMethod,
                    o.PaymentStatus,

                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        ProductName = oi.Product!.Name,
                        oi.Quantity,
                        oi.Price
                    })
                })
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
            int id,
            [FromBody] OrderStatus status)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            order.Status = status;

            await _context.SaveChangesAsync();

            return Ok(order);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    CustomerName = o.User!.FullName,
                    CustomerEmail = o.User.Email,
                    o.TotalPrice,
                    o.Status,
                    o.CreatedAt,
                    o.DeliveryAddress,
                    o.PaymentMethod,
                    o.PaymentStatus,

                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        ProductName = oi.Product!.Name,
                        oi.Quantity,
                        oi.Price
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }
        [HttpGet("restaurant/{restaurantId}")]
        public async Task<IActionResult> GetOrdersByRestaurant(int restaurantId)
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.OrderItems.Any(oi => oi.Product!.RestaurantId == restaurantId))
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    CustomerName = o.User!.FullName,
                    CustomerEmail = o.User.Email,
                    o.TotalPrice,
                    o.Status,
                    o.CreatedAt,
                    o.DeliveryAddress,
                    o.PaymentMethod,
                    o.PaymentStatus,

                    Items = o.OrderItems
                        .Where(oi => oi.Product!.RestaurantId == restaurantId)
                        .Select(oi => new
                        {
                            oi.ProductId,
                            ProductName = oi.Product!.Name,
                            oi.Quantity,
                            oi.Price
                        })
                    })
                    .ToListAsync();

            return Ok(orders);
        }
    }
}