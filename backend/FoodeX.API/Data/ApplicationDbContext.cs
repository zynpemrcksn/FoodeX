using FoodeX.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodeX.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<FavoriteRestaurant> FavoriteRestaurants { get; set; }
        public DbSet<RestaurantApplication> RestaurantApplications { get; set; }
    }
}