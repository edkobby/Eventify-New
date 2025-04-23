"use client"

import { useState, useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../App"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("attendee")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { loginDirect } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !name) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      // Use the direct login function that bypasses registration
      const result = await loginDirect(name, email, role)

      if (result.success) {
        // Redirect based on user role
        if (result.role === "organizer") {
          navigate("/organizer/dashboard")
        } else {
          // Redirect to the page they tried to access or home
          navigate(from)
        }
      } else {
        setError(result.message || "Login failed")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Log in to Eventify</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input
                  id="attendee"
                  type="radio"
                  name="role"
                  value="attendee"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  checked={role === "attendee"}
                  onChange={() => setRole("attendee")}
                  disabled={isLoading}
                />
                <label htmlFor="attendee" className="ml-2 block text-sm text-gray-700">
                  Attendee (I want to discover and attend events)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="organizer"
                  type="radio"
                  name="role"
                  value="organizer"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  checked={role === "organizer"}
                  onChange={() => setRole("organizer")}
                  disabled={isLoading}
                />
                <label htmlFor="organizer" className="ml-2 block text-sm text-gray-700">
                  Organizer (I want to create and manage events)
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Continue to Eventify"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Need to create an account?{" "}
            <Link to="/register" className="text-teal-600 hover:text-teal-800">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>This is a demo application. No real authentication is performed.</p>
          <p>Simply enter your details and select a role to access the platform.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
