import { Link } from "react-router-dom"
import { Calendar, MapPin, Clock } from "lucide-react"

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
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

  // Find the lowest priced ticket
  const lowestPrice = event.ticketTypes.reduce(
    (min, ticket) => (ticket.price < min ? ticket.price : min),
    event.ticketTypes[0].price,
  )

  return (
    <div className="event-card bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative">
        <img src={event.bannerImage || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
        {event.featured && (
          <div className="absolute top-2 right-2 featured-badge text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between">
          <div className="category-badge text-xs font-medium px-2.5 py-0.5 rounded">{event.category}</div>
          <div className="text-gray-700 text-sm">
            From{" "}
            <span className="font-bold text-purple-600">
              {event.ticketTypes[0].currency} {lowestPrice}
            </span>
          </div>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>

        <p className="mt-1 text-gray-600 text-sm line-clamp-2">{event.description}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-500" />
            <span>{formatTime(event.date)}</span>
          </div>

          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-purple-500" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to={`/events/${event.id}`}
            className="w-full block text-center py-2 px-4 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-medium rounded-md transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard
