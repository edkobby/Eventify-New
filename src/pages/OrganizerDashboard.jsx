"use client"

import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Plus, Calendar, Users, Ticket, Edit, Trash2, ChevronDown, ChevronUp, Search, Mail } from "lucide-react"
import { AuthContext, EventContext, NotificationContext } from "../App"

const OrganizerDashboard = () => {
  const { currentUser } = useContext(AuthContext)
  const { events, setEvents } = useContext(EventContext)
  const { addNotification } = useContext(NotificationContext)
  const [expandedEventId, setExpandedEventId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const attendeesPerPage = 5

  if (!currentUser || !currentUser.isOrganizer) {
    return <Navigate to="/login" />
  }

  // Get events created by the current user
  const myEvents = events.filter((event) => event.organizerId === currentUser.id)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getTotalTicketsSold = (event) => {
    return event.ticketTypes.reduce((sum, ticket) => sum + ticket.sold, 0)
  }

  const getTotalTicketsAvailable = (event) => {
    return event.ticketTypes.reduce((sum, ticket) => sum + ticket.available, 0)
  }

  const getTotalTicketsLeft = (event) => {
    return getTotalTicketsAvailable(event) - getTotalTicketsSold(event)
  }

  const getTotalRevenue = (event) => {
    return event.ticketTypes.reduce((sum, ticket) => sum + ticket.price * ticket.sold, 0)
  }

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId))
      addNotification("Event deleted successfully", "success")
    }
  }

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId)
    setCurrentPage(1) // Reset to first page when toggling
  }

  // Mock attendee data for demonstration
  const getEventAttendees = (eventId) => {
    // In a real app, this would come from the backend
    const mockAttendees = []
    const event = events.find((e) => e.id === eventId)

    if (!event) return []

    // Generate mock attendees based on tickets sold
    event.ticketTypes.forEach((ticket) => {
      for (let i = 0; i < ticket.sold; i++) {
        mockAttendees.push({
          id: `${eventId}-${ticket.id}-${i}`,
          name: `Attendee ${i + 1}`,
          email: `attendee${i + 1}@example.com`,
          ticketType: ticket.name,
          paymentStatus: Math.random() > 0.1 ? "Paid" : "Pending", // 90% paid, 10% pending
        })
      }
    })

    return mockAttendees
  }

  const handleSendEmail = (eventId) => {
    addNotification("Email functionality coming soon!", "info")
  }

  // Pagination logic for attendees
  const getPagedAttendees = (eventId) => {
    const attendees = getEventAttendees(eventId)

    // Filter attendees by search term if any
    const filteredAttendees = searchTerm
      ? attendees.filter(
          (a) =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.ticketType.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : attendees

    const startIndex = (currentPage - 1) * attendeesPerPage
    return {
      attendees: filteredAttendees.slice(startIndex, startIndex + attendeesPerPage),
      totalPages: Math.ceil(filteredAttendees.length / attendeesPerPage),
      totalAttendees: filteredAttendees.length,
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
        <Link
          to="/organizer/create-event"
          className="flex items-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-300"
        >
          <Plus className="h-5 w-5 mr-1" />
          Create Event
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{myEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Ticket className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tickets Sold</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myEvents.reduce((sum, event) => sum + getTotalTicketsSold(event), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                GH₵ {myEvents.reduce((sum, event) => sum + getTotalRevenue(event), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Event Reminders */}
      {myEvents.some((event) => new Date(event.date) > new Date()) && (
        <div className="bg-gradient-to-r from-purple-100 to-teal-100 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Event Reminders</h2>
          <div className="space-y-2">
            {myEvents
              .filter((event) => new Date(event.date) > new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 3)
              .map((event) => (
                <div key={`reminder-${event.id}`} className="flex items-center">
                  <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">{event.title}</span> is coming up on {formatDate(event.date)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Events</h2>
        </div>

        {myEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Left
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myEvents.map((event) => (
                  <>
                    <tr key={event.id} className={expandedEventId === event.id ? "bg-gray-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={event.bannerImage || "/placeholder.svg"}
                              alt={event.title}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(event.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getTotalTicketsSold(event)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getTotalTicketsLeft(event)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.ticketTypes[0].currency} {getTotalRevenue(event)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleEventDetails(event.id)}
                            className="text-purple-600 hover:text-purple-900"
                            title={expandedEventId === event.id ? "Hide details" : "Show details"}
                          >
                            {expandedEventId === event.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                          <Link to={`/organizer/edit-event/${event.id}`} className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedEventId === event.id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4">
                          <div className="bg-white rounded-md border border-gray-200 p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Attendee List</h3>

                            {/* Search and Email Controls */}
                            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search attendees..."
                                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              </div>

                              <button
                                onClick={() => handleSendEmail(event.id)}
                                className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Send Email to All
                              </button>
                            </div>

                            {/* Attendees Table */}
                            {getPagedAttendees(event.id).totalAttendees > 0 ? (
                              <>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Name
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Email
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Ticket Type
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Payment Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {getPagedAttendees(event.id).attendees.map((attendee) => (
                                        <tr key={attendee.id}>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {attendee.name}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {attendee.email}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {attendee.ticketType}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            <span
                                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                attendee.paymentStatus === "Paid"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-yellow-100 text-yellow-800"
                                              }`}
                                            >
                                              {attendee.paymentStatus}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Pagination */}
                                {getPagedAttendees(event.id).totalPages > 1 && (
                                  <div className="flex justify-between items-center mt-4">
                                    <div className="text-sm text-gray-500">
                                      Showing {(currentPage - 1) * attendeesPerPage + 1} to{" "}
                                      {Math.min(
                                        currentPage * attendeesPerPage,
                                        getPagedAttendees(event.id).totalAttendees,
                                      )}{" "}
                                      of {getPagedAttendees(event.id).totalAttendees} attendees
                                    </div>
                                    <div className="flex space-x-1">
                                      <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                                      >
                                        Previous
                                      </button>
                                      <button
                                        onClick={() =>
                                          setCurrentPage((prev) =>
                                            Math.min(prev + 1, getPagedAttendees(event.id).totalPages),
                                          )
                                        }
                                        disabled={currentPage === getPagedAttendees(event.id).totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                                      >
                                        Next
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                No attendees found matching your search.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-4 text-center">
            <p className="text-gray-600">You haven't created any events yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizerDashboard
