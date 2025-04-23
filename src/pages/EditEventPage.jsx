"use client"

import { useState, useContext, useEffect } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { Plus, Minus, Calendar, Clock, MapPin } from "lucide-react"
import { AuthContext, EventContext, NotificationContext } from "../App"
import ImageUploader from "../components/ImageUploader"

const EditEventPage = () => {
  const { eventId } = useParams()
  const { currentUser } = useContext(AuthContext)
  const { events, setEvents } = useContext(EventContext)
  const { addNotification } = useContext(NotificationContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)

  // Find the event
  const event = events.find((e) => e.id === Number.parseInt(eventId))

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        endDate: event.endDate,
        location: event.location,
        bannerImage: event.bannerImage,
        featured: event.featured,
        ticketTypes: event.ticketTypes.map((ticket) => ({
          id: ticket.id,
          name: ticket.name,
          price: ticket.price,
          available: ticket.available,
          sold: ticket.sold,
          currency: ticket.currency,
        })),
      })
    }
  }, [event])

  if (!currentUser || !currentUser.isOrganizer) {
    return <Navigate to="/login" />
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
        <p className="mt-2 text-gray-600">The event you're trying to edit doesn't exist or has been removed.</p>
      </div>
    )
  }

  if (event.organizerId !== currentUser.id) {
    return <Navigate to="/organizer/dashboard" />
  }

  if (!formData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      bannerImage: imageUrl,
    }))
  }

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticketTypes]
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === "price" || field === "available" ? Number.parseInt(value) : value,
    }

    setFormData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }))
  }

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: "", price: 0, available: 100, sold: 0, currency: "GH₵" }],
    }))
  }

  const removeTicketType = (index) => {
    if (formData.ticketTypes.length === 1) {
      return
    }

    const updatedTickets = formData.ticketTypes.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.description || !formData.date || !formData.endDate || !formData.location) {
      addNotification("Please fill in all required fields", "error")
      return
    }

    // Validate ticket types
    for (const ticket of formData.ticketTypes) {
      if (!ticket.name || ticket.price < 0 || ticket.available <= 0) {
        addNotification("Please fill in all ticket information correctly", "error")
        return
      }
    }

    // Update event
    const updatedEvent = {
      ...event,
      ...formData,
      tags: [formData.category.toLowerCase()],
      ticketTypes: formData.ticketTypes.map((ticket, index) => ({
        id: ticket.id || Date.now() + index,
        ...ticket,
      })),
    }

    // Update events state
    setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)))

    // Show success notification
    addNotification("Event updated successfully!", "success")

    // Navigate to dashboard
    navigate("/organizer/dashboard")
  }

  const categories = [
    "Technology",
    "Food & Drink",
    "Music",
    "Business",
    "Sports",
    "Arts",
    "Fashion",
    "Education",
    "Health",
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.category}
                  onChange={handleChange}
                  required
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

          {/* Date and Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Date and Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date and Time *
                </label>
                <input
                  id="date"
                  name="date"
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  End Date and Time *
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Image</h2>
            <ImageUploader initialImage={formData.bannerImage} onImageChange={handleImageChange} />
          </div>

          {/* Ticket Types */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ticket Types</h2>
              <button
                type="button"
                onClick={addTicketType}
                className="flex items-center text-sm text-teal-600 hover:text-teal-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Ticket Type
              </button>
            </div>

            {formData.ticketTypes.map((ticket, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Ticket Type #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="text-gray-500 hover:text-teal-600"
                    disabled={formData.ticketTypes.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={ticket.name}
                      onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Tickets</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={ticket.available}
                      onChange={(e) => handleTicketChange(index, "available", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tickets Sold</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                      value={ticket.sold}
                      disabled
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Event */}
          <div>
            <div className="flex items-center">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Feature this event on the homepage
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-md transition-colors duration-300"
            >
              Update Event
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditEventPage
