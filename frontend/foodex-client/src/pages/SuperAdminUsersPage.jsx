import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function SuperAdminUsersPage() {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5115/api/Users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error))
  }, [])

  if (!users) {
    return <Spinner />
  }

  return (
    <section>
      <div className="admin-header">
        <div>
          <h1>Users</h1>
          <p>Manage platform users.</p>
        </div>
      </div>

      <div className="applications-list">
        {users.map((user) => (
          <div
            key={user.id}
            className="application-card"
          >
            <h3>{user.fullName}</h3>

            <p>{user.email}</p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>

            {user.restaurantName && (
              <p>
                <strong>Restaurant:</strong>{" "}
                {user.restaurantName}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default SuperAdminUsersPage