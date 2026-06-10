import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function AdminOrdersPage({
  cartItems,
  setIsCartOpen,
  showToast,
  logout
}) {
  const [orders, setOrders] = useState([])

  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  )

  const deliveredOrders = orders.filter(
    (order) => order.status === 3
  ).length

  const preparingOrders = orders.filter(
    (order) => order.status === 1
  ).length

  const getOrders = () => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Orders/restaurant/${user.restaurantId}`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error(error))
  }

  const updateOrderStatus = async (orderId, status) => {
    const response = await fetch(
      `http://localhost:5115/api/Orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Number(status))
      }
    )

    if (!response.ok) {
      showToast("Status update failed.")
      return
    }

    getOrders()
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div>     
        <div className="admin-header">
          <div>
            <h1>Orders Panel </h1>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Revenue</span>
              <strong>${totalRevenue.toFixed(0)}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Preparing</span>
              <strong>{preparingOrders}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Delivered</span>
              <strong>{deliveredOrders}</strong>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>

                    <p>
                      {order.customerName} • {order.customerEmail}
                    </p>

                    <p>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p>
                      {order.items.length} items • {order.paymentMethod}
                    </p>

                    <p>
                      📍 {order.deliveryAddress || "No address"}
                    </p>
                  </div>

                  <span
                    className={`status-badge ${
                      order.status === 1
                        ? "preparing"
                        : order.status === 2
                        ? "ontheway"
                        : "delivered"
                    }`}
                  >
                    {order.status === 1 && "Preparing"}
                    {order.status === 2 && "On The Way"}
                    {order.status === 3 && "Delivered"}
                  </span>
                </div>

                <select
                  className="admin-status-select"
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order.id, e.target.value)
                  }
                >
                  <option value={1}>Preparing</option>
                  <option value={2}>On The Way</option>
                  <option value={3}>Delivered</option>
                </select>

                <div className="order-total">
                  Total: ${order.totalPrice.toFixed(2)}
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="view-details-button"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="activity-section">
            <h2>Recent Activity</h2>

            <div className="activity-list">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="activity-item"
                >
                  <div className="activity-dot"></div>

                  <div>
                    <strong>Order #{order.id}</strong>

                    <p>
                      {order.customerName} placed an order
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdminOrdersPage