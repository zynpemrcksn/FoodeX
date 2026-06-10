import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function CheckoutPage({
  cartItems,
  clearCart,
  setIsCartOpen,
  logout,
  showToast
}) {
  const navigate = useNavigate()

  const savedUser = JSON.parse(localStorage.getItem("user"))

  const savedAddress = savedUser?.address || ""
  const savedPhoneNumber = savedUser?.phoneNumber || ""

  const [addressOption, setAddressOption] = useState(
    savedAddress ? "saved" : "new"
  )

  const [deliveryAddress, setDeliveryAddress] = useState(
    savedAddress || ""
  )

  const [paymentMethod, setPaymentMethod] = useState("Credit Card")

  const [phoneNumber, setPhoneNumber] = useState(
    savedPhoneNumber || ""
  )

  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const deliveryFee = 2.99

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const finalTotal = totalPrice + deliveryFee

  const handlePlaceOrder = async () => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) {
      showToast("Please login first.", "error")
      return
    }

    if (!phoneNumber.trim()) {
      showToast("Please enter your phone number.", "error")
      return
    }

    if (!deliveryAddress.trim()) {
      showToast("Please enter delivery address.", "error")
      return
    }

    if (paymentMethod === "Credit Card") {
      if (
        !cardName.trim() ||
        !cardNumber.trim() ||
        !expiryDate.trim() ||
        !cvv.trim()
      ) {
        showToast("Please enter your card details.", "error")
        return
      }
    }

    const user = JSON.parse(savedUser)

    const orderData = {
      userId: user.id,
      deliveryAddress,
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }))
    }

    const response = await fetch("http://localhost:5115/api/Orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      showToast(errorMessage || "Order failed.", "error")
      return
    }

    showToast("Order placed successfully!")

    clearCart()
    navigate("/order-success")
  }

  return (
    <div>
      <Navbar
        cartItems={cartItems}
        currentUser={JSON.parse(localStorage.getItem("user"))}
        logout={logout}
      />

      <main className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form">
            <h2>Delivery Details</h2>

            <input
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            {savedAddress && (
              <div className="saved-address-box">
                <label>
                  <input
                    type="radio"
                    checked={addressOption === "saved"}
                    onChange={() => {
                      setAddressOption("saved")
                      setDeliveryAddress(savedAddress)
                    }}
                  />
                  Use saved address
                </label>

                <label>
                  <input
                    type="radio"
                    checked={addressOption === "new"}
                    onChange={() => {
                      setAddressOption("new")
                      setDeliveryAddress("")
                    }}
                  />
                  Enter a new address
                </label>
              </div>
            )}

            <textarea
              placeholder="Enter delivery address"
              value={deliveryAddress}
              disabled={addressOption === "saved"}
              onChange={(e) =>
                setDeliveryAddress(e.target.value)
              }
            />

            <textarea
              placeholder="Add delivery note (optional)"
              className="order-note"
            />

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option value="Credit Card">
                Credit Card
              </option>

              <option value="Cash on Delivery">
                Cash on Delivery
              </option>
            </select>

            {paymentMethod === "Credit Card" && (
              <div className="card-details">
                <input
                  type="text"
                  placeholder="Cardholder name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />

                <div className="card-row">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="checkout-item"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <strong>
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}

            <div className="checkout-price-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="checkout-price-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>

            <div className="checkout-price-row">
              <span>Estimated Delivery</span>
              <span>25-35 min</span>
            </div>

            <div className="checkout-total">
              Total: ${finalTotal.toFixed(2)}
            </div>

            <div className="secure-payment">
              🔒 Secure payment powered by FoodeX
            </div>

            <button
              className="place-order-button"
              onClick={handlePlaceOrder}
            >
              Complete Order
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CheckoutPage