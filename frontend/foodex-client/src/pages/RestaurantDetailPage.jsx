import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import Spinner from "../components/Spinner"

function RestaurantDetailPage({
  addToCart,
  cartItems,
  setIsCartOpen,
  logout
}) {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:5115/api/Restaurants/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRestaurant(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })

    fetch(`http://localhost:5115/api/Reviews/restaurant/${id}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error(error))
  }, [id])

  if (loading) {
    return <Spinner />
  }

  if (!restaurant) {
    return <p>Restaurant not found.</p>
  }

  const groupedProducts = restaurant.products.reduce((groups, product) => {
    const category = product.category || "Other"

    if (!groups[category]) {
      groups[category] = []
    }

    groups[category].push(product)

    return groups
  }, {})

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

        <section className="detail-hero">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <span>⭐ {restaurant.rating}</span>
          <p>{restaurant.address}</p>
        </section>

        <section className="restaurant-review-preview">
          <div className="review-preview-header">
            <h2>Customer Reviews</h2>

            {reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "Show less" : "View all reviews"}
              </button>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="review-muted">No reviews yet.</p>
          ) : (
            <div className="compact-reviews-list">
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map(
                (review) => (
                  <div
                    className="compact-review-card"
                    key={review.id}
                  >
                    <div className="review-stars">
                      {"⭐".repeat(review.rating)}
                    </div>

                    <p>{review.comment || "No comment."}</p>

                    <span>
                      {review.userName} •{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <h2 className="section-title">Menu</h2>

        {Object.entries(groupedProducts).map(([category, products]) => (
          <section
            className="menu-category-section"
            key={category}
          >
            <h3 className="menu-category-title">
              {category}
            </h3>

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}

export default RestaurantDetailPage