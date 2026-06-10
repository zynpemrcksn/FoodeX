import { Link } from "react-router-dom"

function CartSidebar({
  cartItems,
  isCartOpen,
  setIsCartOpen,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
      <div className="cart-sidebar-header">
        <h2>Your Cart</h2>

        <button onClick={() => setIsCartOpen(false)}>
          ✕
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state sidebar-empty-state">
          <div className="empty-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Add some delicious products to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="cart-sidebar-items">
            {cartItems.map((item) => (
              <div key={item.id} className="sidebar-item">
                <div>
                  <h4>{item.name}</h4>

                  <div className="sidebar-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.id)}>
                      +
                    </button>

                    <button
                      className="sidebar-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <strong>
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="sidebar-total">
            Total: ${totalPrice.toFixed(2)}
          </div>

          <Link
            to="/cart"
            className="go-cart-button"
            onClick={() => setIsCartOpen(false)}
          >
            Go to Cart
          </Link>
        </>
      )}
    </div>
  )
}

export default CartSidebar