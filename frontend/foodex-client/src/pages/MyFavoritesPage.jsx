import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Spinner from "../components/Spinner"
import { Link } from "react-router-dom"

function MyFavoritesPage({
  cartItems,
  setIsCartOpen,
  logout,
  showToast
}) {
  const [favorites, setFavorites] = useState(null)

  const getFavorites = () => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Favorites/user/${user.id}`)
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getFavorites()
  }, [])

  const removeFavorite = async (restaurantId) => {
    const savedUser = localStorage.getItem("user")
    if (!savedUser) return

    const user = JSON.parse(savedUser)

    const response = await fetch(
      `http://localhost:5115/api/Favorites/${user.id}/${restaurantId}`,
      {
        method: "DELETE"
      }
    )

    if (!response.ok) {
      showToast("Favorite could not be removed.", "error")
      return
    }

    showToast("Removed from favorites.")
    getFavorites()
  }

  if (!favorites) {
    return <Spinner />
  }

  return (
    <div>
      <Navbar
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        currentUser={JSON.parse(localStorage.getItem("user"))}
        logout={logout}
      />

      <main className="container">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <div className="admin-header">
          <div>
            <h1>My Favorite Restaurants</h1>
            <p>Restaurants you saved for later.</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❤️</div>
            <h2>No favorites yet</h2>
            <p>Add restaurants to your favorites from the home page.</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {favorites.map((favorite) => (
              <div className="restaurant-card" key={favorite.restaurantId}>
                <button
                  className="favorite-button active"
                  onClick={() => removeFavorite(favorite.restaurantId)}
                >
                  ❤️
                </button>

                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                  alt={favorite.restaurantName}
                />

                <div className="restaurant-content">
                  <div className="restaurant-header">
                    <h3>{favorite.restaurantName}</h3>
                    <span className="rating">⭐ {favorite.rating}</span>
                  </div>

                  <p className="address">{favorite.address}</p>
                  <p className="description">{favorite.description}</p>

                  <Link
                    to={`/restaurants/${favorite.restaurantId}`}
                    className="view-button"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MyFavoritesPage