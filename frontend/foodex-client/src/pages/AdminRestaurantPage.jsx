import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function AdminRestaurantPage() {
  const [restaurant, setRestaurant] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Restaurants/${user.restaurantId}`)
      .then((response) => response.json())
      .then((data) => setRestaurant(data))
      .catch((error) => console.error(error))
  }, [])

  if (!restaurant) {
    return <Spinner />
  }

  const lowStockProducts = restaurant.products.filter(
    (product) => product.stock < 10
  )

  const totalStock = restaurant.products.reduce(
    (total, product) => total + product.stock,
    0
  )
  const groupedProducts = restaurant.products.reduce((groups, product) => {
    const category = product.category || "Other"

    if (!groups[category]) {
      groups[category] = []
    }

    groups[category].push(product)

    return groups
  }, {})

  return (
    <section className="restaurant-overview">
      <div className="restaurant-overview-hero">
        <img
          src={
            restaurant.imageUrl ||
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
          }
          alt={restaurant.name}
        />

        <div>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>

          <div className="restaurant-info-list">
            <span>📍 {restaurant.address}</span>
            <span>⭐ {restaurant.rating}</span>
            <span>🍔 {restaurant.products.length} products</span>
          </div>
        </div>
      </div>

      <div className="admin-stats overview-stats">
        <div className="admin-stat-card">
          <span>Total Products</span>
          <strong>{restaurant.products.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Low Stock</span>
          <strong>{lowStockProducts.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Restaurant Rating</span>
          <strong>{restaurant.rating}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Stock</span>
          <strong>{totalStock}</strong>
        </div>
      </div>

      <h2>Restaurant Products</h2>

      {Object.entries(groupedProducts).map(([category, products]) => (
        <section className="menu-category-section" key={category}>
          <h3 className="menu-category-title">
            {category}
          </h3>

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                />

                <div className="product-content">
                  <h3>{product.name}</h3>

                  <p
                    className={
                      product.stock > 0 && product.stock < 10
                        ? "low-stock"
                        : "normal-stock"
                    }
                  >
                    Stock: {product.stock}
                  </p>

                  <div className="product-footer">
                    <span>${product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}

export default AdminRestaurantPage