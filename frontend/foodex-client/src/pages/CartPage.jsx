import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"

function CartPage({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  showToast,
  setIsCartOpen,
  logout
}) {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

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

        <h1>Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>

            <h2>Your cart is empty</h2>

            <p>
              Add some delicious products to get started.
            </p>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <div className="cart-item-footer">
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.id)}>
                      +
                    </button>

                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>

                  <strong>
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}

            <div className="cart-total">
              Total: ${totalPrice.toFixed(2)}
            </div>

            <Link to="/checkout" className="place-order-button">
              Continue to Checkout
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default CartPage