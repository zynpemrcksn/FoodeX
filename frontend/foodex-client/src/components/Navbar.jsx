import { Link } from "react-router-dom"
import { useState } from "react"

function Navbar({
  cartItems = [],
  setIsCartOpen,
  hideCart = false,
  currentUser,
  logout
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const isAdmin = currentUser?.role === "admin"
  const isSuperAdmin = currentUser?.role === "superadmin"

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <nav className="navbar">
      <Link
        to={isAdmin ? "/admin/overview" : "/"}
        className="logo-link"
      >
        FoodeX
      </Link>

      <div className="navbar-actions">
        {currentUser && (
          <div className="user-menu-wrapper">
            <button
              className="user-button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#800020"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">

                {isSuperAdmin ? (
                  <>
                    <Link
                      to="/superadmin/overview"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      SuperAdmin Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </>
                ) : isAdmin ? (
                  <>
                    <Link
                      to="/admin/overview"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Restaurant
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/admin/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Restaurant Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Favorites
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                  </>
                )}

                <button onClick={logout}>
                  Logout
                </button>

              </div>
            )}
          </div>
        )}

        {!currentUser && (
          <>
            <Link
              to="/become-partner"
              className="partner-link"
            >
              Become a Partner
            </Link>
            <Link
              to="/login"
              className="login-button"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-button"
            >
              Register
            </Link>
          </>
        )}

        {!hideCart && !isAdmin && (
          <button
            className="cart-icon"
            onClick={() => setIsCartOpen(true)}
          >
            🛒 Cart ({cartCount})
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar