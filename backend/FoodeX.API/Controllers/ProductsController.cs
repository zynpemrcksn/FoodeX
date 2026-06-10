using FoodeX.API.Data;
using FoodeX.API.DTOs;
using FoodeX.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductResponseDto>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Restaurant)
                .AsNoTracking()
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Description = p.Description,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    RestaurantId = p.RestaurantId,
                    RestaurantName = p.Restaurant != null ? p.Restaurant.Name : string.Empty,
                    Category = p.Category,
                })
                .ToListAsync();

            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDto>> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Restaurant)
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Description = p.Description,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    RestaurantId = p.RestaurantId,
                    RestaurantName = p.Restaurant != null ? p.Restaurant.Name : string.Empty,
                    Category = p.Category,
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<ProductResponseDto>> CreateProduct(CreateProductDto createProductDto)
        {
            var restaurantExists = await _context.Restaurants
                .AnyAsync(r => r.Id == createProductDto.RestaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exist.");
            }

            var product = new Product
            {
                Name = createProductDto.Name,
                Price = createProductDto.Price,
                Description = createProductDto.Description,
                Stock = createProductDto.Stock,
                ImageUrl = createProductDto.ImageUrl,
                RestaurantId = createProductDto.RestaurantId,
                Category = createProductDto.Category,
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto updateProductDto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            var restaurantExists = await _context.Restaurants
                .AnyAsync(r => r.Id == updateProductDto.RestaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exist.");
            }

            product.Name = updateProductDto.Name;
            product.Price = updateProductDto.Price;
            product.Description = updateProductDto.Description;
            product.Stock = updateProductDto.Stock;
            product.ImageUrl = updateProductDto.ImageUrl;
            product.RestaurantId = updateProductDto.RestaurantId;
            product.Category = updateProductDto.Category;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}