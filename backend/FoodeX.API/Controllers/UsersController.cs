using FoodeX.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Restaurant)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Role,
                    u.PhoneNumber,
                    u.Address,
                    u.RestaurantId,
                    RestaurantName = u.Restaurant != null
                        ? u.Restaurant.Name
                        : null
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Role,
                    u.PhoneNumber,
                    u.Address,
                    u.RestaurantId
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(
            int id,
            UpdateUserProfileDto dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.Address = dto.Address;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(
            int id,
            ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            if (!BCrypt.Net.BCrypt.Verify(
                dto.CurrentPassword,
                user.PasswordHash))
            {
                return BadRequest("Current password is incorrect.");
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut("{id}/force-change-password")]
        public async Task<IActionResult> ForceChangePassword(
            int id,
            ForceChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            user.MustChangePassword = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class UpdateUserProfileDto
    {
        public string FullName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;

        public string NewPassword { get; set; } = string.Empty;
    }
    public class ForceChangePasswordDto
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}