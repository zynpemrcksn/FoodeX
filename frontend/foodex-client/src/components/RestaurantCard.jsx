import { Link } from "react-router-dom"

function RestaurantCard({
  restaurant,
  isFavorite,
  onToggleFavorite
}) {
  return (
    <div className="restaurant-card">
      <button
        className={`favorite-button ${isFavorite ? "active" : ""}`}
        onClick={() => onToggleFavorite(restaurant.id)}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <img
        src={
          restaurant.imageUrl &&
          restaurant.imageUrl.trim() !== ""
            ? restaurant.imageUrl
            : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
        }
        alt={restaurant.name}
      />

      <div className="restaurant-content">
        <div className="restaurant-header">
          <h3>{restaurant.name}</h3>

          <span className="rating">
            ⭐ {restaurant.rating}
          </span>
        </div>

        <p className="address">
          {restaurant.address}
        </p>

        <p className="description">
          {restaurant.description}
        </p>

        <Link
          to={`/restaurants/${restaurant.id}`}
          className="view-button"
        >
          View Menu
        </Link>
      </div>
    </div>
  )
}

export default RestaurantCard