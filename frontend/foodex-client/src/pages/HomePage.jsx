import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import RestaurantCard from "../components/RestaurantCard"
import Spinner from "../components/Spinner"
import Footer from "../components/Footer"

function HomePage({
  cartItems,
  setIsCartOpen,
  currentUser,
  logout
}) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    setLoading(true)

    fetch("http://localhost:5115/api/Restaurants")
      .then((response) => response.json())
      .then((data) => {
        setRestaurants(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!currentUser) return

    fetch(`http://localhost:5115/api/Favorites/user/${currentUser.id}`)
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error(error))
  }, [currentUser])

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const keyword = searchText.toLowerCase().trim()

    if (!keyword) return true

    const restaurantMatches =
      restaurant.name.toLowerCase().includes(keyword) ||
      restaurant.description.toLowerCase().includes(keyword) ||
      restaurant.address.toLowerCase().includes(keyword)

    const productMatches = restaurant.products?.some((product) =>
      product.name.toLowerCase().includes(keyword)
    )

    return restaurantMatches || productMatches
  })

  const matchingProducts = restaurants.flatMap((restaurant) => {
    const keyword = searchText.toLowerCase().trim()

    if (!keyword) return []

    return (
      restaurant.products
        ?.filter((product) =>
          product.name.toLowerCase().includes(keyword)
        )
        .map((product) => ({
          ...product,
          restaurantName: restaurant.name,
          restaurantId: restaurant.id
        })) || []
    )
  })

  const handleToggleFavorite = async (restaurantId) => {
    if (!currentUser) {
      return
    }

    const isFavorite = favorites.some(
      (favorite) => favorite.restaurantId === restaurantId
    )

    if (isFavorite) {
      const response = await fetch(
        `http://localhost:5115/api/Favorites/${currentUser.id}/${restaurantId}`,
        {
          method: "DELETE"
        }
      )

      if (!response.ok) return

      setFavorites(
        favorites.filter(
          (favorite) => favorite.restaurantId !== restaurantId
        )
      )
    } else {
      const response = await fetch("http://localhost:5115/api/Favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: currentUser.id,
          restaurantId
        })
      })

      if (!response.ok) return

      setFavorites([
        ...favorites,
        {
          restaurantId
        }
      ])
    }
  }

  return (
    <div>
      <Navbar
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        currentUser={currentUser}
        logout={logout}
      />

      <main className="container">
        <section className="hero">
          <div>
            {currentUser && (
              <span className="hero-user">
                Hi, {currentUser.fullName} 👋
              </span>
            )}

            <h1>Order your favorite food</h1>
            <p>Discover restaurants near you and enjoy delicious meals.</p>
          </div>

          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </section>

        {loading && <Spinner />}

        {searchText.trim() && matchingProducts.length > 0 && (
          <section className="home-section">
            <h2 className="section-title">
              Matching Products
            </h2>

            <div className="product-grid">
              {matchingProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                  />

                  <div className="product-content">
                    <h3>{product.name}</h3>
                    <p>{product.restaurantName}</p>

                    <div className="product-footer">
                      <span>${product.price}</span>

                      <a
                        href={`/restaurants/${product.restaurantId}`}
                        className="view-details-button"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="home-section">
          <h2 className="section-title">
            Popular Restaurants
          </h2>

          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorite={favorites.some(
                  (favorite) => favorite.restaurantId === restaurant.id
                )}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>

        {!loading &&
          filteredRestaurants.length === 0 &&
          matchingProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>

              <h2>No results found</h2>

              <p>
                Try searching for another restaurant or product.
              </p>
            </div>
          )}
      </main>

      <Footer />
    </div>
  )
}

export default HomePage