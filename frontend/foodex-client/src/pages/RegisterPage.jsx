import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function RegisterPage({ showToast }) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    const response = await fetch("http://localhost:5115/api/Auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName,
        email,
        password
      })
    })

    if (!response.ok) {
      showToast("Registration failed.", "error")
      return
    }

    showToast("Registration successful!")
    navigate("/login")
  }

  return (
    <div>
      <Navbar hideCart={true} />

      <main className="auth-page">
        <section className="auth-image-panel register-image-panel">
          <div>
            <h1>Join the FoodeX</h1>

            <p>
              Discover amazing restaurants, explore new flavors,
              and enjoy a seamless food ordering experience.
            </p>

            <div className="auth-features">
              <span>✓ Discover restaurants</span>
              <span>✓ Fast online ordering</span>
              <span>✓ Track your orders</span>
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <form className="auth-card modern-auth-card" onSubmit={handleRegister}>
            <h1>Register</h1>

            <p>Create your FoodeX account</p>

            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Register</button>

            <span>
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </span>
          </form>
        </section>
      </main>
    </div>
  )
}

export default RegisterPage