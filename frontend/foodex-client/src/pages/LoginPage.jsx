import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function LoginPage({
  setCurrentUser,
  showToast
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const response = await fetch("http://localhost:5115/api/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await response.json()
      console.log("LOGIN DATA:", data)

    if (!response.ok) {
      showToast("Invalid email or password.", "error")
      return
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    setCurrentUser(data.user)

    showToast("Login successful!")

    if (data.mustChangePassword) {
      navigate("/change-password")
      return
    }

    if (data.user.role === "superadmin") {
      navigate("/superadmin/overview")
    } else if (data.user.role === "admin") {
      navigate("/admin/overview")
    } else {
      navigate("/")
    }
  }

  return (
    <div>
      <Navbar hideCart={true} />

      <main className="auth-page">
        <section className="auth-image-panel">
          <div>
            <h1>Welcome to FoodeX</h1>
            <p>
              Discover your favorite restaurants, order delicious meals,
              and enjoy fast delivery with FoodeX.
            </p>
          </div>
        </section>

        <section className="auth-form-panel">
          <form className="auth-card modern-auth-card" onSubmit={handleLogin}>
            <h1>Login</h1>

            <p>Welcome back! Please login to your account.</p>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit">Login</button>

            <span>
              Don't have an account?{" "}
              <Link to="/register">Register</Link>
            </span>
          </form>
        </section>
      </main>
    </div>
  )
}

export default LoginPage