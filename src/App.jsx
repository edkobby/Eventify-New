"use client"

import { useState, createContext, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import EventDetailPage from "./pages/EventDetailPage"
import OrganizerDashboard from "./pages/OrganizerDashboard"
import CreateEventPage from "./pages/CreateEventPage"
import EditEventPage from "./pages/EditEventPage"
import MyTicketsPage from "./pages/MyTicketsPage"
import LoginPage from "./pages/LoginPage"
import TicketDetailsPage from "./pages/TicketDetailsPage"
import NotificationCenter from "./components/NotificationCenter"
import { sampleEvents, sampleUsers } from "./data/sampleData"
import RegisterPage from "./pages/RegisterPage"

// Create contexts for global state
export const AuthContext = createContext()
export const EventContext = createContext()
export const NotificationContext = createContext()

function App() {
  // User authentication state
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Events state
  const [events, setEvents] = useState(sampleEvents)

  // Notifications state
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Add a notification
  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      read: false,
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])

    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowNotifications(false)
    }, 5000)
  }

  // Login function
  const login = (email, password) => {
    // In a real app, this would be an API call to your backend
    const user = sampleUsers.find((u) => u.email === email && u.password === password)
    if (user) {
      // Store user in localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(user))
      setCurrentUser(user)
      addNotification(`Welcome back, ${user.name}!`, "success")
      return { success: true, role: user.role }
    }
    return { success: false, message: "Invalid email or password" }
  }

  // Login directly without checking existing users
  const loginDirect = (name, email, role) => {
    // Create a new user on the fly
    const newUser = {
      id: Date.now(),
      name,
      email,
      isOrganizer: role === "organizer",
      role,
      tickets: [],
      events: [],
    }

    // Store user in localStorage for persistence
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setCurrentUser(newUser)
    addNotification(`Welcome, ${name}!`, "success")
    return { success: true, role }
  }

  // Logout function
  const logout = () => {
    console.log("Logout function called")
    try {
      localStorage.removeItem("currentUser")
      console.log("localStorage cleared")
      setCurrentUser(null)
      console.log("currentUser state set to null")
      addNotification("You have been logged out", "info")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  // Register function
  const register = (name, email, password, role) => {
    // Check if email already exists
    if (sampleUsers.some((user) => user.email === email)) {
      return { success: false, message: "Email already in use" }
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      isOrganizer: role === "organizer",
      role,
      tickets: [],
      events: [],
    }

    // In a real app, you would save this to a database via API
    // For now, we'll just set as current user
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setCurrentUser(newUser)
    addNotification("Registration successful!", "success")
    return { success: true }
  }

  // Purchase ticket function
  const purchaseTicket = (eventId, ticketTypeId, quantity) => {
    if (!currentUser) {
      return { success: false, message: "Please log in to purchase tickets" }
    }

    const event = events.find((e) => e.id === eventId)
    if (!event) {
      return { success: false, message: "Event not found" }
    }

    const ticketType = event.ticketTypes.find((t) => t.id === ticketTypeId)
    if (!ticketType) {
      return { success: false, message: "Ticket type not found" }
    }

    if (ticketType.available - ticketType.sold < quantity) {
      return { success: false, message: "Not enough tickets available" }
    }

    // Create new ticket(s)
    const newTickets = []
    for (let i = 0; i < quantity; i++) {
      const ticketId = Date.now() + i
      const newTicket = {
        id: ticketId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        ticketType: ticketType.name,
        price: ticketType.price,
        currency: ticketType.currency,
        purchaseDate: new Date().toISOString(),
        qrCode: `${event.id}-${ticketType.id}-${ticketId}-${currentUser.id}`,
      }
      newTickets.push(newTicket)
    }

    // Update user's tickets
    const updatedUser = {
      ...currentUser,
      tickets: [...currentUser.tickets, ...newTickets],
    }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)

    // Update event's ticket availability
    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        const updatedTicketTypes = e.ticketTypes.map((t) => {
          if (t.id === ticketTypeId) {
            return { ...t, sold: t.sold + quantity }
          }
          return t
        })
        return { ...e, ticketTypes: updatedTicketTypes }
      }
      return e
    })
    setEvents(updatedEvents)

    return {
      success: true,
      message: `Successfully purchased ${quantity} ${ticketType.name} ticket(s)!`,
      tickets: newTickets,
    }
  }

  // Log when currentUser changes
  useEffect(() => {
    console.log("Current user state:", currentUser)
  }, [currentUser])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, purchaseTicket, loginDirect }}>
      <EventContext.Provider value={{ events, setEvents }}>
        <NotificationContext.Provider
          value={{
            notifications,
            showNotifications,
            setShowNotifications,
            addNotification,
          }}
        >
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />

              {/* Notification popup */}
              <NotificationCenter />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events/:eventId" element={<EventDetailPage />} />
                  <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                  <Route path="/organizer/create-event" element={<CreateEventPage />} />
                  <Route path="/organizer/edit-event/:eventId" element={<EditEventPage />} />
                  <Route path="/my-tickets" element={<MyTicketsPage />} />
                  <Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </NotificationContext.Provider>
      </EventContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
