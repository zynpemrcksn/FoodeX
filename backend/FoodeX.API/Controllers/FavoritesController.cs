using FoodeX.API.Data;
using FoodeX.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoritesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserFavorites(int userId)
        {
            var favorites = await _context.FavoriteRestaurants
                .Include(f => f.Restaurant)
                .Where(f => f.UserId == userId)
                .Select(f => new
                {
                    f.Id,
                    f.RestaurantId,
                    RestaurantName = f.Restaurant!.Name,
                    f.Restaurant.Description,
                    f.Restaurant.Address,
                    f.Restaurant.Rating,
                    f.Restaurant.Logo
                })
                .ToListAsync();

            return Ok(favorites);
        }

        [HttpPost]
        public async Task<IActionResult> AddFavorite(FavoriteRestaurantDto dto)
        {
            var exists = await _context.FavoriteRestaurants
                .AnyAsync(f =>
                    f.UserId == dto.UserId &&
                    f.RestaurantId == dto.RestaurantId
                );

            if (exists)
            {
                return BadRequest("Restaurant is already in favorites.");
            }

            var favorite = new FavoriteRestaurant
            {
                UserId = dto.UserId,
                RestaurantId = dto.RestaurantId
            };

            _context.FavoriteRestaurants.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{userId}/{restaurantId}")]
        public async Task<IActionResult> RemoveFavorite(
            int userId,
            int restaurantId)
        {
            var favorite = await _context.FavoriteRestaurants
                .FirstOrDefaultAsync(f =>
                    f.UserId == userId &&
                    f.RestaurantId == restaurantId
                );

            if (favorite == null)
            {
                return NotFound();
            }

            _context.FavoriteRestaurants.Remove(favorite);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class FavoriteRestaurantDto
    {
        public int UserId { get; set; }

        public int RestaurantId { get; set; }
    }
}