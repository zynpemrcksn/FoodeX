import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"

function MyOrdersPage({
  cartItems,
  setIsCartOpen,
  logout,
  addToCart,
  showToast
}) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Orders/user/${user.id}`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error(error))
  }, [])

  const getStatusText = (status) => {
    if (status === 1) return "Preparing"
    if (status === 2) return "On The Way"
    if (status === 3) return "Delivered"

    return "Unknown"
  }
  const handleOrderAgain = (order) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.productId,
          name: item.productName,
          price: item.price,
          description: "",
          imageUrl: item.imageUrl || "cheeseburger.png"
        })
      }
    })

  showToast("Order added to cart again!")
  setIsCartOpen(true)
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

        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>

            <h2>No orders yet</h2>

            <p>
              Place your first order and it will appear here.
            </p>

            <Link to="/" className="view-details-button">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
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

              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.productId}>
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

              <div className="order-actions">
                <Link
                  to={`/orders/${order.id}`}
                  className="view-details-button"
                >
                  View Details
                </Link>

                <button
                  className="view-details-button"
                  onClick={() => handleOrderAgain(order)}
                >
                  Order Again
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}

export default MyOrdersPage