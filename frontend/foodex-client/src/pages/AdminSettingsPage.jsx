import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"
function AdminSettingsPage({showToast}) {
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

  const handleSaveChanges = async () => {
    const response = await fetch(
      `http://localhost:5115/api/Restaurants/${restaurant.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: restaurant.name,
          description: restaurant.description,
          address: restaurant.address,
          imageUrl: restaurant.imageUrl || ""
        })
      }
    )

    if (!response.ok) {
      showToast("Restaurant update failed.", "error")
      return
    }

    showToast("Restaurant updated successfully!")
  }

  if (!restaurant) {
    return <Spinner />
  }

  return (
    <section>
      <div className="admin-header">
        <div>
          <h1>Restaurant Settings</h1>
          <p>Update your restaurant information.</p>
        </div>
      </div>

      <div className="settings-card">
        <label>Restaurant Name</label>
        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurant.name}
          onChange={(e) =>
            setRestaurant({
              ...restaurant,
              name: e.target.value
            })
          }
        />

        <label>Description</label>
        <textarea
          placeholder="Restaurant Description"
          value={restaurant.description}
          onChange={(e) =>
            setRestaurant({
              ...restaurant,
              description: e.target.value
            })
          }
        />

        <label>Address</label>
        <input
          type="text"
          placeholder="Restaurant Address"
          value={restaurant.address}
          onChange={(e) =>
            setRestaurant({
              ...restaurant,
              address: e.target.value
            })
          }
        />
        <label>Restaurant Cover Image URL</label>
        <input
          type="text"
          placeholder="Restaurant cover image URL"
          value={restaurant.imageUrl || ""}
          onChange={(e) =>
            setRestaurant({
              ...restaurant,
              imageUrl: e.target.value
            })
          }
        />

        <button onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default AdminSettingsPage