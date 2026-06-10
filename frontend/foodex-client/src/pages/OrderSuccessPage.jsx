import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

function OrderSuccessPage({
  cartItems,
  setIsCartOpen,
  logout,
  showToast
}) {
  return (
    <div>
      <Navbar
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        currentUser={JSON.parse(localStorage.getItem("user"))}
        logout={logout}
      />

      <main className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Order Confirmed!</h1>

          <p>
            Your order has been placed successfully.
            Estimated delivery time is 25-35 minutes.
          </p>

          <div className="success-actions">
            <Link to="/my-orders" className="success-primary-button">
                Track Order
            </Link>

            <Link to="/" className="back-home-button">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderSuccessPage