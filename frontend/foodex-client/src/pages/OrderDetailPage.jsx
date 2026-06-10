import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Spinner from "../components/Spinner"

function OrderDetailPage({
  cartItems,
  setIsCartOpen,
  logout,
  showToast
}) {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [existingReview, setExistingReview] = useState(null)

  const navigate = useNavigate()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const currentUser = JSON.parse(localStorage.getItem("user"))

  const steps = [
    "Order Received",
    "Preparing",
    "On The Way",
    "Delivered"
  ]

  const getStatusText = (status) => {
    if (status === 1) return "Preparing"
    if (status === 2) return "On The Way"
    if (status === 3) return "Delivered"

    return "Unknown"
  }

  const getActiveStep = (status) => {
    if (status === 1) return 1
    if (status === 2) return 2
    if (status === 3) return 3

    return 0
  }

  const getOrder = () => {
    fetch(`http://localhost:5115/api/Orders/${id}`)
      .then((response) => response.json())
      .then((data) => setOrder(data))
      .catch((error) => console.error(error))
  }

  const getExistingReview = () => {
    fetch(`http://localhost:5115/api/Reviews/order/${id}`)
      .then((response) => response.json())
      .then((data) => setExistingReview(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getOrder()
    getExistingReview()
  }, [id])

  const handleSubmitReview = async () => {
    if (!currentUser) return

    if (!comment.trim()) {
      showToast("Please write a review comment.", "error")
      return
    }

    const response = await fetch("http://localhost:5115/api/Reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rating: Number(rating),
        comment,
        userId: currentUser.id,
        restaurantId: order.restaurantId,
        orderId: order.id
      })
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      showToast(errorMessage || "Review could not be submitted.", "error")
      return
    }

    showToast("Review submitted successfully!")

    setComment("")
    getExistingReview()
  }

  if (!order) {
    return <Spinner />
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
        <button
          className="back-link back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="order-card">
          <div className="order-header">
            <div>
              <h3>Order #{order.id}</h3>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <span
              className={`status-badge ${
                order.status === 1
                  ? "preparing"
                  : order.status === 2
                  ? "ontheway"
                  : order.status === 3
                  ? "delivered"
                  : ""
              }`}
            >
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="tracking-timeline">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`tracking-step ${
                  index <= getActiveStep(order.status)
                    ? "active"
                    : ""
                }`}
              >
                <div className="tracking-circle">
                  {index <= getActiveStep(order.status)
                    ? "✓"
                    : ""}
                </div>

                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div
                className="order-item"
                key={item.productId}
              >
                <span>{item.productName}</span>

                <span>
                  {item.quantity} × ${item.price}
                </span>
              </div>
            ))}
          </div>

          <div className="order-total">
            Total: ${order.totalPrice.toFixed(2)}
          </div>

          <div className="order-items">
            <p>
              <strong>Delivery Address:</strong>{" "}
              {order.deliveryAddress || "Not provided"}
            </p>

            <p>
              <strong>Payment Method:</strong>{" "}
              {order.paymentMethod || "Not provided"}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              {order.paymentStatus || "Not provided"}
            </p>

            <p>
              <strong>Estimated Delivery:</strong> 25-35 min
            </p>
          </div>

          {order.status === 3 &&
            currentUser?.role === "customer" &&
            existingReview && (
              <div className="review-card">
                <h2>Your Review</h2>

                <div className="review-stars">
                  {"⭐".repeat(existingReview.rating)}
                </div>

                <p>
                  {existingReview.comment || "No comment."}
                </p>

                <span>
                  {new Date(existingReview.createdAt).toLocaleString()}
                </span>
              </div>
            )}

          {order.status === 3 &&
            currentUser?.role === "customer" &&
            !existingReview && (
              <div className="review-card">
                <h2>Rate this restaurant</h2>

                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>

                <textarea
                  rows="4"
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button onClick={handleSubmitReview}>
                  Submit Review
                </button>
              </div>
            )}
        </div>
      </main>
    </div>
  )
}

export default OrderDetailPage