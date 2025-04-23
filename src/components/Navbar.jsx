"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bell, User, LogOut, Calendar, Ticket, Menu } from "lucide-react"
import { AuthContext, NotificationContext } from "../App"
import Logo from "./Logo"

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext)
  const { notifications, showNotifications, setShowNotifications } = useContext(NotificationContext)
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
                Eventify
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            >
              Home
            </Link>

            {currentUser?.isOrganizer && (
              <Link
                to="/organizer/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
              >
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Organizer Dashboard
                </span>
              </Link>
            )}

            {currentUser && (
              <Link
                to="/my-tickets"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
              >
                <span className="flex items-center">
                  <Ticket className="w-4 h-4 mr-1" />
                  My Tickets
                </span>
              </Link>
            )}

            {currentUser ? (
              <div className="relative flex items-center ml-3">
                <button
                  className="relative p-1 rounded-full text-gray-600 hover:text-purple-600 focus:outline-none"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-teal-500 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="ml-3 relative group">
                  <div className="flex items-center">
                    <button className="flex text-sm rounded-full focus:outline-none">
                      <span className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600/10 to-teal-500/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-600" />
                      </span>
                    </button>
                    <span className="ml-2 text-gray-700">{currentUser.name}</span>
                    <span className="ml-2 text-xs text-gray-500">({currentUser.role})</span>
                  </div>

                  <div className="hidden group-hover:block absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={() => {
                        logout()
                        navigate("/")
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 rounded-md"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-gray-50 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
