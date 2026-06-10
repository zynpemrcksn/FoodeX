import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function AdminStockPage({ showToast }) {
  const [restaurant, setRestaurant] = useState(null)
  const [stockValues, setStockValues] = useState({})

  const getRestaurant = () => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Restaurants/${user.restaurantId}`)
      .then((response) => response.json())
      .then((data) => {
        setRestaurant(data)

        const values = {}

        data.products.forEach((product) => {
          values[product.id] = product.stock
        })

        setStockValues(values)
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getRestaurant()
  }, [])

  const updateStock = async (product, newStock) => {
    const response = await fetch(
      `http://localhost:5115/api/Products/${product.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: product.name,
          price: Number(product.price),
          description: product.description || "No description",
          stock: Number(newStock),
          imageUrl: product.imageUrl || "cheeseburger.png",
          category: product.category || "Burgers",
          restaurantId: restaurant.id
        })
      }
    )

    if (!response.ok) {
      showToast("Stock could not be updated.", "error")
      return
    }

    showToast("Stock updated successfully!")
    getRestaurant()
  }

  if (!restaurant) {
    return <Spinner />
  }

  const lowStockProducts = restaurant.products.filter(
    (product) => product.stock > 0 && product.stock < 10
  )

  const outOfStockProducts = restaurant.products.filter(
    (product) => product.stock === 0
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
    <section>
      <div className="admin-header">
        <div>
          <h1>Stock Panel</h1>
          <p>Manage stock levels for {restaurant.name}.</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Products</span>
          <strong>{restaurant.products.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Low Stock</span>
          <strong>{lowStockProducts.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Out of Stock</span>
          <strong>{outOfStockProducts.length}</strong>
        </div>
      </div>

      {Object.entries(groupedProducts).map(([category, products]) => (
        <section className="menu-category-section" key={category}>
          <h3 className="menu-category-title">
            {category}
          </h3>

          <div className="stock-table">
            {products.map((product) => (
              <div className="stock-row" key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                </div>

                <input
                  className="stock-input"
                  type="text"
                  value={stockValues[product.id] ?? ""}
                  onChange={(e) =>
                    setStockValues({
                      ...stockValues,
                      [product.id]: e.target.value
                    })
                  }
                />

                <button
                  className="stock-save-button"
                  onClick={() =>
                    updateStock(product, stockValues[product.id])
                  }
                >
                  Save
                </button>

                <span
                  className={`status-badge ${
                    product.stock === 0
                      ? "preparing"
                      : product.stock < 10
                      ? "ontheway"
                      : "delivered"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.stock < 10
                    ? "Low Stock"
                    : "In Stock"}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}

export default AdminStockPage