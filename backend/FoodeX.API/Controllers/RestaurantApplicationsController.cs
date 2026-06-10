using FoodeX.API.Data;
using FoodeX.API.Models;
using FoodeX.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public RestaurantApplicationsController(
            ApplicationDbContext context,
            EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateApplication(
            RestaurantApplicationDto dto)
        {
            var application = new RestaurantApplication
            {
                RestaurantName = dto.RestaurantName,
                OwnerFullName = dto.OwnerFullName,
                OwnerEmail = dto.OwnerEmail,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                Description = dto.Description,
                CuisineType = dto.CuisineType,
                LogoUrl = dto.LogoUrl,
                Status = "Pending"
            };

            _context.RestaurantApplications.Add(application);
            await _context.SaveChangesAsync();

            return Ok("Application submitted successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetApplications()
        {
            var applications = await _context.RestaurantApplications
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectApplication(int id)
        {
            var application =
                await _context.RestaurantApplications.FindAsync(id);

            if (application == null)
            {
                return NotFound();
            }

            application.Status = "Rejected";

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveApplication(int id)
        {
            var application = await _context.RestaurantApplications
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound();
            }

            if (application.Status == "Approved")
            {
                return BadRequest("Application already approved.");
            }

            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == application.OwnerEmail);

            if (emailExists)
            {
                return BadRequest("A user with this email already exists.");
            }

            var restaurant = new Restaurant
            {
                Name = application.RestaurantName,
                Address = application.Address,
                Description = application.Description,
                Rating = 0,
                Logo = application.LogoUrl,
                ImageUrl = application.LogoUrl
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            var temporaryPassword = "Admin123!";

            var admin = new User
            {
                FullName = application.OwnerFullName,
                Email = application.OwnerEmail,
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
                Role = "admin",
                RestaurantId = restaurant.Id,
                MustChangePassword = true
            };

            _context.Users.Add(admin);
            application.Status = "Approved";

            await _context.SaveChangesAsync();

            var emailBody = $@"
Hello {admin.FullName},

Your restaurant application has been approved.

Restaurant:
{restaurant.Name}

Login Information:

Email:
{admin.Email}

Temporary Password:
{temporaryPassword}

For security reasons, please change your password after your first login.

FoodeX Team
";

            await _emailService.SendEmailAsync(
                admin.Email,
                "Your FoodeX Restaurant Application Has Been Approved",
                emailBody
            );

            return Ok(new
            {
                message =
                    "Application approved successfully. Email sent to restaurant admin."
            });
        }
    }

    public class RestaurantApplicationDto
    {
        public string RestaurantName { get; set; } = string.Empty;

        public string OwnerFullName { get; set; } = string.Empty;

        public string OwnerEmail { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string CuisineType { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
    }
}