"use client"

import { useContext } from "react"
import { Link, Navigate } from "react-router-dom"
import { Plus, Calendar, Users, Ticket, Edit, Trash2 } from "lucide-react"
import { AuthContext, EventContext, NotificationContext } from "../App"

const OrganizerDashboard = () => {
  const { currentUser } = useContext(AuthContext)
  const { events, setEvents } = useContext(EventContext)
  const { addNotification } = useContext(NotificationContext)

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

  const getTotalRevenue = (event) => {
    return event.ticketTypes.reduce((sum, ticket) => sum + ticket.price * ticket.sold, 0)
  }

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId))
      addNotification("Event deleted successfully", "success")
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
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myEvents.map((event) => (
                  <tr key={event.id}>
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
                      {getTotalTicketsSold(event)} /{" "}
                      {event.ticketTypes.reduce((sum, ticket) => sum + ticket.available, 0)}/{" "}
                      {event.ticketTypes.reduce((sum, ticket) => sum + ticket.available, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.ticketTypes[0].currency} {getTotalRevenue(event)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/organizer/edit-event/${event.id}`} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
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
