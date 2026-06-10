using FoodeX.API.Data;
using FoodeX.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview(CreateReviewDto dto)
        {
            var alreadyReviewed = await _context.Reviews
                .AnyAsync(r => r.OrderId == dto.OrderId);

            if (alreadyReviewed)
            {
                return BadRequest("You have already reviewed this order.");
            }

            var review = new Review
            {
                Rating = dto.Rating,
                Comment = dto.Comment,
                UserId = dto.UserId,
                RestaurantId = dto.RestaurantId,
                OrderId = dto.OrderId
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var averageRating = await _context.Reviews
                .Where(r => r.RestaurantId == dto.RestaurantId)
                .AverageAsync(r => r.Rating);

            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.Id == dto.RestaurantId);

            if (restaurant == null)
            {
                return BadRequest("Restaurant not found.");
            }

            restaurant.Rating = Math.Round(averageRating, 1);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("restaurant/{restaurantId}")]
        public async Task<IActionResult> GetRestaurantReviews(int restaurantId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.RestaurantId == restaurantId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.UserId,
                    UserName = r.User!.FullName,
                    r.RestaurantId,
                    r.OrderId,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetReviewByOrderId(int orderId)
        {
            var review = await _context.Reviews
                .Where(r => r.OrderId == orderId)
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.OrderId,
                    r.CreatedAt
                })
                .FirstOrDefaultAsync();

            return Ok(review);
        }
    }

    public class CreateReviewDto
    {
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        public int UserId { get; set; }

        public int RestaurantId { get; set; }

        public int OrderId { get; set; }
    }
}