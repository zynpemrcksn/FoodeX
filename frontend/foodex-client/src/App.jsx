import ChangePasswordPage from "./pages/ChangePasswordPage"
import SuperAdminUsersPage from "./pages/SuperAdminUsersPage"
import SuperAdminRestaurantsPage from "./pages/SuperAdminRestaurantsPage"
import SuperAdminLayout from "./components/SuperAdminLayout"
import SuperAdminOverviewPage from "./pages/SuperAdminOverviewPage"
import SuperAdminApplicationsPage from "./pages/SuperAdminApplicationsPage"
import BecomePartnerPage from "./pages/BecomePartnerPage"
import MyFavoritesPage from "./pages/MyFavoritesPage"
import AdminReviewsPage from "./pages/AdminReviewsPage"
import ProfilePage from "./pages/ProfilePage"
import Toast from "./components/Toast"
import AdminSettingsPage from "./pages/AdminSettingsPage"
import AdminStockPage from "./pages/AdminStockPage"
import AdminLayout from "./components/AdminLayout"
import AdminRestaurantPage from "./pages/AdminRestaurantPage"
import AdminMenuPage from "./pages/AdminMenuPage"
import AdminOrdersPage from "./pages/AdminOrdersPage"
import OrderDetailPage from "./pages/OrderDetailPage"
import OrderSuccessPage from "./pages/OrderSuccessPage"
import CheckoutPage from "./pages/CheckoutPage"
import MyOrdersPage from "./pages/MyOrdersPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import CartSidebar from "./components/CartSidebar"
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import RestaurantDetailPage from "./pages/RestaurantDetailPage"
import CartPage from "./pages/CartPage"

window.alert = (...args) => {
  console.log("ALERT BLOCKED:", args)
}
function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [toast, setToast] = useState({
    message: "",
    type: "success"
  })

  const showToast = (message, type = "success") => {
    setToast({ message, type })

    setTimeout(() => {
      setToast({ message: "", type: "success" })
    }, 2500)
  }

  const [currentUser, setCurrentUser] = useState(null)

  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        showToast("Product added to cart.")
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      showToast("Product added to cart.")
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    )

    showToast("Product removed from cart.", "error")
  }

  const clearCart = () => {
    setCartItems([])
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentUser(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              currentUser={currentUser}
              logout={logout}
            />
          }
        />

        <Route
          path="/restaurants/:id"
          element={
            <RestaurantDetailPage
              addToCart={addToCart}
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              logout={logout}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              showToast={showToast}
              setIsCartOpen={setIsCartOpen}
              logout={logout}
            />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              setCurrentUser={setCurrentUser}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/register"
          element={
            <RegisterPage
              showToast={showToast}
            />
          }
        />

        <Route
          path="/my-orders"
          element={
            <MyOrdersPage
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              logout={logout}
              addToCart={addToCart}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              clearCart={clearCart}
              setIsCartOpen={setIsCartOpen}
              showToast={showToast}
              logout={logout}
            />
          }
        />

        <Route
          path="/order-success"
          element={
            <OrderSuccessPage
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              logout={logout}
            />
          }
        />

        <Route
          path="/orders/:id"
          element={
            <OrderDetailPage
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              logout={logout}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <ProfilePage
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              logout={logout}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <MyFavoritesPage
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              logout={logout}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/change-password"
          element={
            <ChangePasswordPage
              showToast={showToast}
            />
          }
        />

        <Route
          path="/become-partner"
          element={
            <BecomePartnerPage showToast={showToast} />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminLayout
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              currentUser={currentUser}
            />
          }
        >
          <Route path="overview" element={<AdminRestaurantPage />} />

          <Route
            path="orders"
            element={<AdminOrdersPage showToast={showToast} />}
          />

          <Route
            path="menu"
            element={<AdminMenuPage showToast={showToast} />}
          />

          <Route
            path="stock"
            element={<AdminStockPage showToast={showToast} />}
          />

          <Route
            path="reviews"
            element={<AdminReviewsPage />}
          />

          <Route
            path="settings"
            element={<AdminSettingsPage showToast={showToast} />}
          />
        </Route>

        <Route
          path="/superadmin"
          element={
            <SuperAdminLayout
              cartItems={cartItems}
              setIsCartOpen={setIsCartOpen}
              currentUser={currentUser}
              logout={logout}
            />
          }
        >
          <Route
            path="overview"
            element={<SuperAdminOverviewPage />}
          />

          <Route
            path="applications"
            element={
              <SuperAdminApplicationsPage
                showToast={showToast}
              />
            }
          />

          <Route
            path="restaurants"
            element={
              <SuperAdminRestaurantsPage showToast={showToast} />
              }
          />
          <Route
            path="users"
            element={<SuperAdminUsersPage />}
          />
        </Route>
      </Routes>

      <CartSidebar
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
      />

      <Toast
        message={toast.message}
        type={toast.type}
      />
    </BrowserRouter>
  )
}

export default App