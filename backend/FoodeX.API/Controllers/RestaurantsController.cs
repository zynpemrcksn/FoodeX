using FoodeX.API.DTOs;
using FoodeX.API.Data;
using FoodeX.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RestaurantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<RestaurantResponseDto>>> GetRestaurants()
        {
            var restaurants = await _context.Restaurants
                .Include(r => r.Products)
                .AsNoTracking()
                .Select(r => new RestaurantResponseDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Logo = r.Logo,
                    Address = r.Address,
                    Rating = r.Rating,
                    ImageUrl = r.ImageUrl,
                    Description = r.Description,
                    Products = r.Products.Select(p => new ProductResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price,
                        Description = p.Description,
                        Stock = p.Stock,
                        ImageUrl = p.ImageUrl,
                        RestaurantId = p.RestaurantId,
                        RestaurantName = r.Name
                    }).ToList()
                })
                .ToListAsync();

            return restaurants;
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<RestaurantResponseDto>>> SearchRestaurants(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest("Keyword cannot be empty.");
            }

            var restaurants = await _context.Restaurants
                .Include(r => r.Products)
                .AsNoTracking()
                .Where(r =>
                    r.Name.Contains(keyword) ||
                    r.Description.Contains(keyword))
                .Select(r => new RestaurantResponseDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Logo = r.Logo,
                    Address = r.Address,
                    Rating = r.Rating,
                    Description = r.Description,
                    Products = r.Products.Select(p => new ProductResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price,
                        Description = p.Description,
                        Stock = p.Stock,
                        ImageUrl = p.ImageUrl,
                        RestaurantId = p.RestaurantId,
                        RestaurantName = r.Name
                    }).ToList()
                })
                .ToListAsync();

            return restaurants;
        }

        [HttpGet("superadmin")]
        public async Task<IActionResult> GetRestaurantsForSuperAdmin()
        {
            var restaurants = await _context.Restaurants
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Address,
                    r.Rating,

                    Admin = _context.Users
                        .Where(u =>
                            u.Role == "admin" &&
                            u.RestaurantId == r.Id)
                        .Select(u => u.Email)
                        .FirstOrDefault(),

                    ProductCount = r.Products.Count()
                })
                .ToListAsync();

            return Ok(restaurants);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRestaurantById(int id)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Products)
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    r.Address,
                    r.Rating,
                    r.ImageUrl,

                    Products = r.Products.Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Stock,
                        p.ImageUrl,
                        p.Category
                    })
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }

        [HttpPost]
        public async Task<ActionResult<RestaurantResponseDto>> CreateRestaurant(
            CreateRestaurantDto createRestaurantDto)
        {
            var restaurant = new Restaurant
            {
                Name = createRestaurantDto.Name,
                Logo = createRestaurantDto.Logo,
                Address = createRestaurantDto.Address,
                Rating = createRestaurantDto.Rating,
                Description = createRestaurantDto.Description
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetRestaurantById),
                new { id = restaurant.Id },
                restaurant
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRestaurant(
            int id,
            Restaurant updatedRestaurant)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);

            if (restaurant == null)
            {
                return NotFound();
            }

            restaurant.Name = updatedRestaurant.Name;
            restaurant.Description = updatedRestaurant.Description;
            restaurant.Address = updatedRestaurant.Address;
            restaurant.Rating = updatedRestaurant.Rating;
            restaurant.ImageUrl = updatedRestaurant.ImageUrl;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Products)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (restaurant == null)
            {
                return NotFound();
            }

            var orderItems = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .SelectMany(o => o.OrderItems)
                .Where(oi =>
                    oi.Product != null &&
                    oi.Product.RestaurantId == id)
                .ToListAsync();

            if (orderItems.Count > 0)
            {
                return BadRequest(
                    "This restaurant has orders and cannot be deleted."
                );
            }

            var favorites = await _context.FavoriteRestaurants
                .Where(f => f.RestaurantId == id)
                .ToListAsync();

            var reviews = await _context.Reviews
                .Where(r => r.RestaurantId == id)
                .ToListAsync();

            var admins = await _context.Users
                .Where(u => u.RestaurantId == id)
                .ToListAsync();

            foreach (var admin in admins)
            {
                admin.RestaurantId = null;
                admin.Role = "customer";
            }

            _context.FavoriteRestaurants.RemoveRange(favorites);
            _context.Reviews.RemoveRange(reviews);
            _context.Products.RemoveRange(restaurant.Products);
            _context.Restaurants.Remove(restaurant);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}