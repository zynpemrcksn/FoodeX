using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FoodeX.API.Data;
using FoodeX.API.DTOs;
using FoodeX.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IConfiguration _configuration;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == registerDto.Email);

            if (emailExists)
            {
                return BadRequest("Email already exists.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(
                registerDto.Password
            );

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = passwordHash
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return BadRequest("Invalid email or password.");
            }

            var isPasswordCorrect = BCrypt.Net.BCrypt.Verify(
                loginDto.Password,
                user.PasswordHash
            );

            if (!isPasswordCorrect)
            {
                return BadRequest("Invalid email or password.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!
                )
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials
            );

            var jwtToken = new JwtSecurityTokenHandler()
                .WriteToken(token);

            return Ok(new
            {
                token = jwtToken,
                mustChangePassword = user.MustChangePassword,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role,
                    user.PhoneNumber,
                    user.Address,
                    user.RestaurantId
                }
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult Profile()
        {
            return Ok("You are authorized. This is your profile.");
        }
    }
}