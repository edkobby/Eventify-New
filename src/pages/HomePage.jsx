"use client"

import { useContext, useState } from "react"
import { Search, Filter } from "lucide-react"
import { EventContext } from "../App"
import EventCard from "../components/EventCard"

const HomePage = () => {
  const { events } = useContext(EventContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // Get unique categories
  const categories = ["All", ...new Set(events.map((event) => event.category))]

  // Filter events based on search term and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "" || selectedCategory === "All" || event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Featured events
  const featuredEvents = events.filter((event) => event.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with new gradient background */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-500 rounded-xl p-8 mb-8 text-white relative overflow-hidden">
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="max-w-3xl relative z-10">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Events in Ghana</h1>
          <p className="text-lg mb-6 text-white/90">Find and book tickets for the best events happening near you.</p>

          <div className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full px-4 py-3 pr-10 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <select
                className="px-4 py-3 bg-white text-gray-800 rounded-r-md border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
              Featured Events
            </span>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-teal-500 rounded ml-4"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* All Events with subtle pattern background */}
      <div className="hero-pattern rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
              All Events
            </span>
            <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-teal-500 rounded ml-4"></div>
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-1" />
            <span>{filteredEvents.length} events found</span>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
