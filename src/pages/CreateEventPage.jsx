"use client"

import { useState, useContext } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import {
  Plus,
  Minus,
  Calendar,
  Clock,
  MapPin,
  LinkIcon,
  Globe,
  Tag,
  MessageCircle,
  FileText,
  ImageIcon,
  Eye,
} from "lucide-react"
import { AuthContext, EventContext, NotificationContext } from "../App"
import ImageUploader from "../components/ImageUploader"

const CreateEventPage = () => {
  const { currentUser } = useContext(AuthContext)
  const { events, setEvents } = useContext(EventContext)
  const { addNotification } = useContext(NotificationContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technology",
    date: "",
    endDate: "",
    location: "",
    isVirtual: false,
    virtualLink: "",
    eventType: "Conference",
    bannerImage: "/placeholder.svg?height=400&width=800",
    featured: false,
    categories: [],
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    allowAttendeeMessaging: true,
    refundPolicy: "",
    ticketTypes: [
      {
        name: "Regular",
        price: 0,
        available: 100,
        currency: "GH₵",
        description: "",
        image: "",
        customFields: [],
      },
    ],
  })

  const [customCategory, setCustomCategory] = useState("")
  const [customField, setCustomField] = useState({ name: "", required: false })
  const [previewMode, setPreviewMode] = useState(false)

  if (!currentUser || !currentUser.isOrganizer) {
    return <Navigate to="/login" />
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
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

  const handleTicketImageChange = (index, imageUrl) => {
    const updatedTickets = [...formData.ticketTypes]
    updatedTickets[index] = {
      ...updatedTickets[index],
      image: imageUrl,
    }

    setFormData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }))
  }

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        {
          name: "",
          price: 0,
          available: 100,
          currency: "GH₵",
          description: "",
          image: "",
          customFields: [],
        },
      ],
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

  const addCategory = () => {
    if (customCategory.trim() && !formData.categories.includes(customCategory.trim())) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, customCategory.trim()],
      }))
      setCustomCategory("")
    }
  }

  const removeCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }))
  }

  const addCustomField = (ticketIndex) => {
    if (customField.name.trim()) {
      const updatedTickets = [...formData.ticketTypes]
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        customFields: [...(updatedTickets[ticketIndex].customFields || []), { ...customField }],
      }

      setFormData((prev) => ({
        ...prev,
        ticketTypes: updatedTickets,
      }))
      setCustomField({ name: "", required: false })
    }
  }

  const removeCustomField = (ticketIndex, fieldIndex) => {
    const updatedTickets = [...formData.ticketTypes]
    const updatedFields = updatedTickets[ticketIndex].customFields.filter((_, i) => i !== fieldIndex)

    updatedTickets[ticketIndex] = {
      ...updatedTickets[ticketIndex],
      customFields: updatedFields,
    }

    setFormData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.endDate ||
      (!formData.location && !formData.isVirtual) ||
      (formData.isVirtual && !formData.virtualLink)
    ) {
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

    // Create new event
    const newEvent = {
      id: Date.now(),
      ...formData,
      organizerId: currentUser.id,
      organizer: currentUser.name,
      tags: [...formData.categories, formData.category.toLowerCase()],
      ticketTypes: formData.ticketTypes.map((ticket, index) => ({
        id: Date.now() + index,
        ...ticket,
        sold: 0,
      })),
    }

    // Add event to state
    setEvents([...events, newEvent])

    // Show success notification
    addNotification("Event created successfully!", "success")

    // Navigate to dashboard
    navigate("/organizer/dashboard")
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  const eventTypes = [
    "Conference",
    "Concert",
    "Festival",
    "Webinar",
    "Workshop",
    "Networking",
    "Exhibition",
    "Party",
    "Other",
  ]

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

  // Preview component
  const EventPreview = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Event Banner */}
        <div className="relative h-64">
          <img
            src={formData.bannerImage || "/placeholder.svg?height=400&width=800"}
            alt={formData.title || "Event Preview"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block mb-2">
              {formData.category || "Category"}
            </div>
            <h1 className="text-3xl font-bold text-white">{formData.title || "Event Title"}</h1>
            <p className="mt-2 text-white/80">Organized by {currentUser.name}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">About this event</h2>
                <p className="text-gray-700">{formData.description || "Event description will appear here."}</p>
              </div>

              <div className="mt-8 space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p className="text-gray-600">
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Date not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-gray-600">
                      {formData.date
                        ? new Date(formData.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Time not set"}{" "}
                      -
                      {formData.endDate
                        ? new Date(formData.endDate).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "End time not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      {formData.isVirtual ? "Virtual Event" : formData.location || "Location not set"}
                    </p>
                  </div>
                </div>
              </div>

              {formData.categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2 text-gray-900">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Tickets</h2>

              <div className="space-y-4">
                {formData.ticketTypes.map((ticket, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{ticket.name || `Ticket Type ${index + 1}`}</h3>
                        <p className="text-sm text-gray-600">{ticket.available} available</p>
                        {ticket.description && <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>}
                      </div>
                      <div className="text-lg font-bold text-amber-600">
                        {ticket.currency} {ticket.price}
                      </div>
                    </div>
                    {ticket.image && (
                      <div className="mt-2">
                        <img
                          src={ticket.image || "/placeholder.svg"}
                          alt={ticket.name}
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <button
          type="button"
          onClick={togglePreview}
          className="flex items-center py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-300"
        >
          <Eye className="h-4 w-4 mr-1" />
          {previewMode ? "Edit Event" : "Preview Event"}
        </button>
      </div>

      {previewMode ? (
        <EventPreview />
      ) : (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Category *
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

                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Categories</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.categories.map((category, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <span className="text-sm">{category}</span>
                        <button
                          type="button"
                          className="ml-1 text-gray-500 hover:text-red-500"
                          onClick={() => removeCategory(category)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add a category"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700"
                      onClick={addCategory}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
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
                  <div className="flex items-center mb-2">
                    <input
                      id="isVirtual"
                      name="isVirtual"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={formData.isVirtual}
                      onChange={handleChange}
                    />
                    <label htmlFor="isVirtual" className="ml-2 block text-sm text-gray-700">
                      This is a virtual event
                    </label>
                  </div>

                  {formData.isVirtual ? (
                    <div>
                      <label htmlFor="virtualLink" className="block text-sm font-medium text-gray-700 mb-1">
                        <Globe className="h-4 w-4 inline mr-1" />
                        Virtual Event Link *
                      </label>
                      <input
                        id="virtualLink"
                        name="virtualLink"
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={formData.virtualLink}
                        onChange={handleChange}
                        placeholder="https://zoom.us/j/example"
                        required={formData.isVirtual}
                      />
                    </div>
                  ) : (
                    <div>
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
                        required={!formData.isVirtual}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Banner</h2>
              <p className="text-sm text-gray-500 mb-2">
                Upload a banner image for your event. Recommended size: 1200 x 600 pixels.
              </p>
              <ImageUploader initialImage={formData.bannerImage} onImageChange={handleImageChange} />
            </div>

            {/* Social Media Links */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    Facebook
                  </label>
                  <input
                    id="facebook"
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/yourevent"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/yourevent"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    Twitter
                  </label>
                  <input
                    id="twitter"
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourevent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="allowAttendeeMessaging"
                    name="allowAttendeeMessaging"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={formData.allowAttendeeMessaging}
                    onChange={handleChange}
                  />
                  <label htmlFor="allowAttendeeMessaging" className="ml-2 block text-sm text-gray-700">
                    <MessageCircle className="h-4 w-4 inline mr-1" />
                    Allow attendees to message the organizer
                  </label>
                </div>

                <div>
                  <label htmlFor="refundPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Refund Policy
                  </label>
                  <textarea
                    id="refundPolicy"
                    name="refundPolicy"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.refundPolicy}
                    onChange={handleChange}
                    placeholder="Describe your refund policy here..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Ticket Setup</h2>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={ticket.name}
                        onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                        placeholder="e.g., VIP, Early Bird, Regular"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={ticket.description}
                        onChange={(e) => handleTicketChange(index, "description", e.target.value)}
                        placeholder="e.g., Includes front row seating"
                      />
                    </div>
                  </div>

                  {/* Ticket Image */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <ImageIcon className="h-4 w-4 inline mr-1" />
                      Ticket Image (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      {ticket.image ? (
                        <div className="relative">
                          <img
                            src={ticket.image || "/placeholder.svg"}
                            alt={`Ticket ${index + 1}`}
                            className="h-20 w-auto object-contain border rounded p-1"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                            onClick={() => handleTicketImageChange(index, "")}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-300 rounded-md p-4 w-full">
                          <div className="flex flex-col items-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500 mt-1">No image uploaded</p>
                            <button
                              type="button"
                              className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                              onClick={() => {
                                // For demo purposes, we'll use a placeholder image
                                handleTicketImageChange(
                                  index,
                                  `/placeholder.svg?height=100&width=200&text=Ticket+${index + 1}`,
                                )
                              }}
                            >
                              Upload Image
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 400 x 200 pixels</p>
                  </div>

                  {/* Custom Fields */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Tag className="h-4 w-4 inline mr-1" />
                        Custom Fields
                      </label>
                    </div>

                    {ticket.customFields && ticket.customFields.length > 0 ? (
                      <div className="mb-3 space-y-2">
                        {ticket.customFields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div>
                              <span className="text-sm font-medium">{field.name}</span>
                              {field.required && <span className="ml-1 text-red-500 text-xs">(Required)</span>}
                            </div>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => removeCustomField(index, fieldIndex)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-3">No custom fields added yet.</p>
                    )}

                    <div className="flex items-end space-x-2">
                      <div className="flex-grow">
                        <input
                          type="text"
                          placeholder="Field name (e.g., T-shirt Size)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={customField.name}
                          onChange={(e) => setCustomField({ ...customField, name: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          id={`required-${index}`}
                          type="checkbox"
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          checked={customField.required}
                          onChange={(e) => setCustomField({ ...customField, required: e.target.checked })}
                        />
                        <label htmlFor={`required-${index}`} className="ml-1 text-sm text-gray-700">
                          Required
                        </label>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                        onClick={() => addCustomField(index)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
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
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={togglePreview}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-300"
              >
                Preview
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-md transition-colors duration-300"
              >
                Publish Event
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateEventPage
