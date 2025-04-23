"use client"

import { useContext } from "react"
import { Link, Navigate } from "react-router-dom"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { AuthContext } from "../App"
import QRCode from "../components/QRCode"

const MyTicketsPage = () => {
  const { currentUser } = useContext(AuthContext)

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Group tickets by event
  const ticketsByEvent = currentUser.tickets.reduce((acc, ticket) => {
    const eventId = ticket.eventId
    if (!acc[eventId]) {
      acc[eventId] = []
    }
    acc[eventId].push(ticket)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tickets</h1>

      {currentUser.tickets.length > 0 ? (
        <div className="space-y-6">
          {Object.values(ticketsByEvent).map((eventTickets) => (
            <div key={eventTickets[0].eventId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 md:flex">
                <div className="md:w-2/3 md:pr-6">
                  <h2 className="text-xl font-semibold text-gray-900">{eventTickets[0].eventTitle}</h2>

                  <div className="mt-4 space-y-3">
                    {eventTickets[0].eventDate && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                        <span>{formatDate(eventTickets[0].eventDate)}</span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2 text-teal-600" />
                      <span>
                        {eventTickets.length} {eventTickets.length === 1 ? "ticket" : "tickets"} purchased
                      </span>
                    </div>

                    {eventTickets[0].eventLocation && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                        <span>{eventTickets[0].eventLocation}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {eventTickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        to={`/tickets/${ticket.id}`}
                        className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-md text-sm hover:bg-teal-200"
                      >
                        {ticket.ticketType}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
                  <QRCode value={eventTickets[0].qrCode} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You don't have any tickets yet.</p>
          <Link
            to="/"
            className="inline-block py-2 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-md transition-colors duration-300"
          >
            Browse Events
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyTicketsPage
