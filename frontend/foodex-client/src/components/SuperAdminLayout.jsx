import { Link, Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"

function SuperAdminLayout({
  cartItems,
  setIsCartOpen,
  currentUser,
  logout
}) {
  const location = useLocation()

  return (
    <div>
      <Navbar
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        currentUser={currentUser}
        logout={logout}
        hideCart={true}
      />

      <main className="container">
        <div className="admin-restaurant-layout">
          <aside className="admin-sidebar">
            <h3>Super Admin</h3>

            <Link
              to="/superadmin/overview"
              className={
                location.pathname === "/superadmin/overview"
                  ? "active"
                  : ""
              }
            >
              Dashboard
            </Link>

            <Link
              to="/superadmin/applications"
              className={
                location.pathname === "/superadmin/applications"
                  ? "active"
                  : ""
              }
            >
              Applications
            </Link>
            <Link
                to="/superadmin/restaurants"
                className={
                    location.pathname === "/superadmin/restaurants"
                        ? "active"
                        : ""
                }
            >
                Restaurants
            </Link>
            <Link
                to="/superadmin/users"
                className={
                    location.pathname === "/superadmin/users"
                        ? "active"
                        : ""
                }
            >
                Users
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

export default SuperAdminLayout