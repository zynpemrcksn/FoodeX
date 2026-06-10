import { useState } from "react"
import { Link } from "react-router-dom"

function BecomePartnerPage({ showToast }) {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerFullName: "",
    ownerEmail: "",
    phoneNumber: "",
    address: "",
    description: "",
    cuisineType: "",
    logoUrl: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(
      "http://localhost:5115/api/RestaurantApplications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    )

    if (!response.ok) {
      showToast("Application could not be submitted.", "error")
      return
    }

    showToast("Application submitted successfully!")

    setFormData({
      restaurantName: "",
      ownerFullName: "",
      ownerEmail: "",
      phoneNumber: "",
      address: "",
      description: "",
      cuisineType: "",
      logoUrl: ""
    })
  }

  return (
    <main className="partner-page">
      <section className="partner-hero">
        <Link to="/" className="logo-link">
          FoodeX
        </Link>

        <h1>Become a FoodeX Partner</h1>

        <p>
          Join FoodeX and start receiving online food orders from customers.
        </p>
      </section>

      <form className="partner-form" onSubmit={handleSubmit}>
        <h2>Restaurant Application</h2>

        <input
          type="text"
          placeholder="Restaurant Name"
          value={formData.restaurantName}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurantName: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Owner Full Name"
          value={formData.ownerFullName}
          onChange={(e) =>
            setFormData({
              ...formData,
              ownerFullName: e.target.value
            })
          }
        />

        <input
          type="email"
          placeholder="Owner Email"
          value={formData.ownerEmail}
          onChange={(e) =>
            setFormData({
              ...formData,
              ownerEmail: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              phoneNumber: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Restaurant Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Cuisine Type e.g. Burger, Pizza, Cafe"
          value={formData.cuisineType}
          onChange={(e) =>
            setFormData({
              ...formData,
              cuisineType: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Restaurant Image URL"
          value={formData.logoUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              logoUrl: e.target.value
            })
          }
        />

        <textarea
          placeholder="Restaurant Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value
            })
          }
        />

        <button type="submit">
          Submit Application
        </button>
      </form>
    </main>
  )
}

export default BecomePartnerPage