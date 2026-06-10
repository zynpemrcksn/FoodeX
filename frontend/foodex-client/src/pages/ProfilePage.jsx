import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Spinner from "../components/Spinner"
import { Link, useNavigate } from "react-router-dom"

function ProfilePage({
  cartItems,
  setIsCartOpen,
  logout,
  showToast
}) {
  const [user, setUser] = useState(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem("user"))
  const handleBack = () => {
  if (currentUser?.role === "superadmin") {
    navigate("/superadmin/overview")
  } else if (currentUser?.role === "admin") {
    navigate("/admin/overview")
  } else {
    navigate("/")
  }
}

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (!savedUser) return

    const currentUser = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Users/${currentUser.id}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error(error))
  }, [])

  const handleSaveProfile = async () => {
    const response = await fetch(
      `http://localhost:5115/api/Users/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          address: user.address
        })
      }
    )

    if (!response.ok) {
      showToast("Profile could not be updated.", "error")
      return
    }

    const savedUser = JSON.parse(localStorage.getItem("user"))

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...savedUser,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address
      })
    )

    showToast("Profile updated successfully!")
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill all password fields.", "error")
      return
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error")
      return
    }

    const response = await fetch(
      `http://localhost:5115/api/Users/${user.id}/change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      showToast(errorMessage || "Password could not be changed.", "error")
      return
    }

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")

    showToast("Password changed successfully!")
  }

  if (!user) {
    return <Spinner />
  }

  return (
    <div>
      <Navbar
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        currentUser={JSON.parse(localStorage.getItem("user"))}
        logout={logout}
      />

      <main className="container profile-page">
      <button
        className="back-link back-button"
        onClick={handleBack}
      >
        ← Back
      </button>
        <div className="admin-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information and account security.</p>
          </div>
        </div>

        <div className="profile-card">
          <h2>Profile Information</h2>

          <label>Full Name</label>
          <input
            type="text"
            value={user.fullName}
            onChange={(e) =>
              setUser({
                ...user,
                fullName: e.target.value
              })
            }
          />

          <label>Email</label>
          <input
            type="email"
            value={user.email}
            disabled
          />

          <label>Phone Number</label>
          <input
            type="text"
            value={user.phoneNumber || ""}
            onChange={(e) =>
              setUser({
                ...user,
                phoneNumber: e.target.value
              })
            }
          />

          <label>Address</label>
          <textarea
            value={user.address || ""}
            onChange={(e) =>
              setUser({
                ...user,
                address: e.target.value
              })
            }
          />

          <button onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>

        <div className="profile-card">
          <h2>Security</h2>

          <label>Current Password</label>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label>New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage