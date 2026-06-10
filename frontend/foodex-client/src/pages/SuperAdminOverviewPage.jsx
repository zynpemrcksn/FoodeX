import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function SuperAdminOverviewPage() {
  const [users, setUsers] = useState(null)
  const [restaurants, setRestaurants] = useState(null)
  const [applications, setApplications] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5115/api/Users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error))

    fetch("http://localhost:5115/api/Restaurants")
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error(error))

    fetch("http://localhost:5115/api/RestaurantApplications")
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => console.error(error))
  }, [])

  if (!users || !restaurants || !applications) {
    return <Spinner />
  }

  const totalAdmins = users.filter((user) => user.role === "admin").length
  const totalCustomers = users.filter((user) => user.role === "customer").length
  const pendingApplications = applications.filter(
    (application) => application.status === "Pending"
  ).length

  return (
    <section>
      <div className="admin-header">
        <div>
          <h1>Super Admin Dashboard</h1>
          <p>Manage FoodeX platform operations.</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Restaurants</span>
          <strong>{restaurants.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Restaurant Admins</span>
          <strong>{totalAdmins}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Customers</span>
          <strong>{totalCustomers}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Pending Applications</span>
          <strong>{pendingApplications}</strong>
        </div>
      </div>
    </section>
  )
}

export default SuperAdminOverviewPage