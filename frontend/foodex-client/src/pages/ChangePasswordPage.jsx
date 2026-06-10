import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ChangePasswordPage({ showToast }) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!newPassword || !confirmPassword) {
      showToast("Please fill all fields.", "error")
      return
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error")
      return
    }

    const savedUser = localStorage.getItem("user")

    if (!savedUser) {
      showToast("User not found.", "error")
      return
    }

    const user = JSON.parse(savedUser)

    const response = await fetch(
      `http://localhost:5115/api/Users/${user.id}/force-change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          newPassword
        })
      }
    )

    if (!response.ok) {
      showToast("Password could not be changed.", "error")
      return
    }

    const updatedUser = {
      ...user,
      mustChangePassword: false
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))

    showToast("Password changed successfully!")

    if (user.role === "admin") {
      navigate("/admin/overview")
    } else if (user.role === "superadmin") {
      navigate("/superadmin/overview")
    } else {
      navigate("/")
    }
  }

  return (
    <main className="change-password-page">
      <form
        className="change-password-card"
        onSubmit={handleChangePassword}
      >
        <h1>Change Password</h1>

        <p>
          Please change your temporary password before continuing.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">
          Change Password
        </button>
      </form>
    </main>
  )
}

export default ChangePasswordPage