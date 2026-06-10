import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function AdminReviewsPage() {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Reviews/restaurant/${user.restaurantId}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error(error))
  }, [])

  if (!reviews) {
    return <Spinner />
  }

  return (
    <section>
      <div className="admin-header">
        <div>
          <h1>Customer Reviews</h1>
          <p>View customer feedback for your restaurant.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h2>No reviews yet</h2>
          <p>Customer reviews will appear here.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-item" key={review.id}>
              <div className="review-stars">
                {"⭐".repeat(review.rating)}
              </div>

              <p>{review.comment || "No comment."}</p>

              <span>
                {new Date(review.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminReviewsPage