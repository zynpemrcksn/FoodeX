import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function SuperAdminApplicationsPage({ showToast }) {
  const [applications, setApplications] = useState(null)
  const [filterStatus, setFilterStatus] = useState("All")

  const getApplications = () => {
    fetch("http://localhost:5115/api/RestaurantApplications")
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getApplications()
  }, [])

  const approveApplication = async (id) => {
    const response = await fetch(
      `http://localhost:5115/api/RestaurantApplications/${id}/approve`,
      {
        method: "PUT"
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      showToast(errorMessage || "Application could not be approved.", "error")
      return
    }

    showToast("Application approved. Login details sent by email.")
    getApplications()
  }

  const rejectApplication = async (id) => {
    const response = await fetch(
      `http://localhost:5115/api/RestaurantApplications/${id}/reject`,
      {
        method: "PUT"
      }
    )

    if (!response.ok) {
      showToast("Application could not be rejected.", "error")
      return
    }

    showToast("Application rejected.")
    getApplications()
  }

  if (!applications) {
    return <Spinner />
  }

  const filteredApplications =
    filterStatus === "All"
      ? applications
      : applications.filter(
          (application) => application.status === filterStatus
        )

  return (
    <section>
      <div className="admin-header">
        <div>
          <h1>Restaurant Applications</h1>
          <p>Review restaurant partner requests.</p>
        </div>
      </div>

      <div className="application-filter">
        <button
          className={filterStatus === "All" ? "active" : ""}
          onClick={() => setFilterStatus("All")}
        >
          All
        </button>

        <button
          className={filterStatus === "Pending" ? "active" : ""}
          onClick={() => setFilterStatus("Pending")}
        >
          Pending
        </button>

        <button
          className={filterStatus === "Approved" ? "active" : ""}
          onClick={() => setFilterStatus("Approved")}
        >
          Approved
        </button>

        <button
          className={filterStatus === "Rejected" ? "active" : ""}
          onClick={() => setFilterStatus("Rejected")}
        >
          Rejected
        </button>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h2>No applications found</h2>
          <p>There are no applications for this filter.</p>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map((application) => (
            <div className="application-card" key={application.id}>
              <div>
                <h2>{application.restaurantName}</h2>

                <p>
                  <strong>Owner:</strong> {application.ownerFullName}
                </p>

                <p>
                  <strong>Email:</strong> {application.ownerEmail}
                </p>

                <p>
                  <strong>Phone:</strong> {application.phoneNumber}
                </p>

                <p>
                  <strong>Address:</strong> {application.address}
                </p>

                <p>
                  <strong>Cuisine:</strong> {application.cuisineType}
                </p>

                <p>{application.description}</p>

                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(application.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`status-badge ${
                  application.status === "Pending"
                    ? "ontheway"
                    : application.status === "Approved"
                    ? "delivered"
                    : "preparing"
                }`}
              >
                {application.status}
              </span>

              {application.status === "Pending" && (
                <div className="application-actions">
                  <button onClick={() => approveApplication(application.id)}>
                    Approve
                  </button>

                  <button
                    className="delete-product-button"
                    onClick={() => rejectApplication(application.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default SuperAdminApplicationsPage