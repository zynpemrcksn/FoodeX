import { Link, Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"

function AdminLayout({
  cartItems,
  setIsCartOpen,
  currentUser,
}) {
  const location = useLocation()

  return (
    <div>
      <Navbar
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        currentUser={currentUser}
        logout={() => {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/login"
        }}
      />

      <main className="container">
        <div className="admin-restaurant-layout">
          <aside className="admin-sidebar">
            <h3>Admin Panel</h3>

            <Link
              to="/admin/overview"
              className={
                location.pathname === "/admin/overview"
                  ? "active"
                  : ""
              }
            >
              Overview
            </Link>

            <Link
              to="/admin/orders"
              className={
                location.pathname === "/admin/orders"
                  ? "active"
                  : ""
              }
            >
              Manage Orders
            </Link>

            <Link
              to="/admin/menu"
              className={
                location.pathname === "/admin/menu"
                  ? "active"
                  : ""
              }
            >
              Manage Menu
            </Link>

            <Link
              to="/admin/stock"
              className={
                location.pathname === "/admin/stock"
                  ? "active"
                  : ""
              }
            >
              Stock Panel
            </Link>
            
            <Link
              to="/admin/reviews"
              className={
                location.pathname === "/admin/reviews"
                  ? "active"
                  : ""
              }
            >
              Customer Reviews
            </Link>
            
            <Link
              to="/admin/settings"
              className={
                location.pathname === "/admin/settings"
                  ? "active"
                  : ""
              }
            >
              Restaurant Settings
            </Link>
          </aside>

          <section className="admin-page-content">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminLayout