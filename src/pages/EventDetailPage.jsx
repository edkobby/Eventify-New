"use client"

import { useContext, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Share2, Heart, Users } from "lucide-react"
import { EventContext, AuthContext, NotificationContext } from "../App"

const EventDetailPage = () => {
  const { eventId } = useParams()
  const { events } = useContext(EventContext)
  const { currentUser, purchaseTicket } = useContext(AuthContext)
  const { addNotification } = useContext(NotificationContext)
  const navigate = useNavigate()

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  // Find the event
  const event = events.find((e) => e.id === Number.parseInt(eventId))

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
        <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleTicketSelect = (ticketId) => {
    const ticket = event.ticketTypes.find((t) => t.id === ticketId)
    setSelectedTicket(ticket)
    setQuantity(1)
  }

  const handlePurchase = async () => {
    if (!currentUser) {
      addNotification("Please log in to purchase tickets", "error")
      navigate("/login", { state: { from: `/events/${eventId}` } })
      return
    }

    if (!selectedTicket) {
      addNotification("Please select a ticket type", "error")
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, this would be an API call to process payment
      const result = await purchaseTicket(event.id, selectedTicket.id, quantity)

      if (result.success) {
        addNotification(result.message, "success")

        // Navigate to the ticket details page if there's at least one ticket
        if (result.tickets && result.tickets.length > 0) {
          navigate(`/tickets/${result.tickets[0].id}`, {
            state: {
              tickets: result.tickets,
              event: event,
            },
          })
        }
      } else {
        addNotification(result.message || "Failed to purchase tickets", "error")
      }
    } catch (error) {
      console.error("Purchase error:", error)
      addNotification("An error occurred while processing your purchase", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Event Banner */}
        <div className="relative h-64 md:h-96">
          <img src={event.bannerImage || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          {event.featured && (
            <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block mb-2">
              {event.category}
            </div>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
            <p className="mt-2 text-white/80">Organized by {event.organizer}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between">
            <div className="mb-4 md:mb-0">{/* Title is now in the banner overlay */}</div>

            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">About this event</h2>
                <p className="text-gray-700">{event.description}</p>
              </div>

              <div className="mt-8 space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-gray-600">
                      {formatTime(event.date)} - {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Attendees</p>
                    <p className="text-gray-600">
                      {event.ticketTypes.reduce((sum, ticket) => sum + ticket.sold, 0)} attending
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Tickets</h2>

              <div className="space-y-4">
                {event.ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                    onClick={() => handleTicketSelect(ticket.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{ticket.name}</h3>
                        <p className="text-sm text-gray-600">{ticket.available - ticket.sold} remaining</p>
                      </div>
                      <div className="text-lg font-bold text-amber-600">
                        {ticket.currency} {ticket.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTicket && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="quantity" className="font-medium text-gray-900">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                      disabled={isProcessing}
                    >
                      {[...Array(Math.min(5, selectedTicket.available - selectedTicket.sold)).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Subtotal:</span>
                      <span className="text-amber-600">
                        {selectedTicket.currency} {selectedTicket.price * quantity}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="mt-6 w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-50"
                onClick={handlePurchase}
                disabled={!selectedTicket || isProcessing}
              >
                {isProcessing ? "Processing..." : currentUser ? "Purchase Tickets" : "Log in to Purchase"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage
