import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function SuperAdminRestaurantsPage({ showToast }) {
  const [restaurants, setRestaurants] = useState(null)

  const getRestaurants = () => {
    fetch("http://localhost:5115/api/Restaurants/superadmin")
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getRestaurants()
  }, [])

  const deleteRestaurant = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    )

    if (!confirmDelete) return

    const response = await fetch(
      `http://localhost:5115/api/Restaurants/${id}`,
      {
        method: "DELETE"
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      showToast(errorMessage || "Restaurant could not be deleted.", "error")
      return
    }

    showToast("Restaurant deleted successfully.")
    getRestaurants()
  }

  if (!restaurants) {
    return <Spinner />
  }

  return (
    <section>
      <div className="admin-header">
        <div>
          <h1>Restaurants</h1>
          <p>Manage all restaurants on FoodeX.</p>
        </div>
      </div>

      <div className="superadmin-restaurants-grid">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="superadmin-restaurant-card"
          >
            <h3>{restaurant.name}</h3>

            <p>
              <strong>Address:</strong>{" "}
              {restaurant.address || "No address"}
            </p>

            <p>
              <strong>Admin:</strong>{" "}
              {restaurant.admin || "No admin assigned"}
            </p>

            <p>
              <strong>Products:</strong>{" "}
              {restaurant.productCount}
            </p>

            <p>
              <strong>Rating:</strong> ⭐ {restaurant.rating}
            </p>

            <div className="restaurant-actions">
              <button
                className="delete-restaurant-button"
                onClick={() => deleteRestaurant(restaurant.id)}
              >
                Delete Restaurant
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SuperAdminRestaurantsPage