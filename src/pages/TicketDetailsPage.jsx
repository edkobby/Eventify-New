"use client"

import { useContext, useState, useRef } from "react"
import { useParams, useLocation, Link, Navigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Download, Printer, Share2, ArrowLeft } from "lucide-react"
import { AuthContext } from "../App"
import QRCode from "../components/QRCode"
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";


const TicketDetailsPage = () => {
  const { ticketId } = useParams()
  const location = useLocation()
  const { currentUser } = useContext(AuthContext)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const ticketRef = useRef(null)

  // If we have state from navigation, use it, otherwise find the ticket in the user's tickets
  const tickets = location.state?.tickets || currentUser?.tickets?.filter((t) => t.id.toString() === ticketId) || []

  const event = location.state?.event || {}

  // If no tickets found, user might have refreshed the page
  const ticket = tickets.length > 0 ? tickets[0] : currentUser?.tickets?.find((t) => t.id.toString() === ticketId)

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Ticket not found</h2>
        <p className="mt-2 text-gray-600">
          The ticket you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link to="/my-tickets" className="mt-4 inline-flex items-center text-teal-600 hover:text-teal-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to My Tickets
        </Link>
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

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return

    setIsDownloading(true)

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`Eventify-Ticket-${ticket.id}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/my-tickets" className="inline-flex items-center text-teal-600 hover:text-teal-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to My Tickets
        </Link>

        <div className="flex space-x-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-1" />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </button>

          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            <Printer className="h-4 w-4 mr-1" />
            {isPrinting ? "Printing..." : "Print Ticket"}
          </button>

          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden" ref={ticketRef}>
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Eventify Ticket</h1>
              <p className="text-white/80">Thank you for your purchase!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Order #: {ticket.id}</p>
              <p className="text-sm text-white/80">Purchased: {formatDate(ticket.purchaseDate)}</p>
            </div>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-6 md:flex">
          <div className="md:w-2/3 md:pr-6">
            <h2 className="text-xl font-semibold text-gray-900">{ticket.eventTitle}</h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                <span>{ticket.eventDate ? formatDate(ticket.eventDate) : "Date information unavailable"}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-teal-600" />
                <span>{ticket.eventDate ? formatTime(ticket.eventDate) : "Time information unavailable"}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                <span>{ticket.eventLocation || "Location information unavailable"}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ticket Type:</span>
                <span className="font-medium">{ticket.ticketType}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">
                  {ticket.currency} {ticket.price}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Attendee:</span>
                <span className="font-medium">{currentUser.name}</span>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-900">Important Information</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Please arrive at least 30 minutes before the event starts</li>
                <li>Have your ticket QR code ready for scanning at the entrance</li>
                <li>This ticket is non-refundable and non-transferable</li>
                <li>For any questions, please contact the event organizer</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 md:mt-0 md:w-1/3 flex flex-col items-center">
            <QRCode value={ticket.qrCode} />
            <p className="mt-4 text-center text-sm text-gray-600">Ticket ID: {ticket.id}</p>
          </div>
        </div>

        {/* Ticket Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Powered by Eventify - Ghana's premier event management platform</p>
        </div>
      </div>

      {tickets.length > 1 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Tickets</h2>
          <div className="space-y-4">
            {tickets.slice(1).map((additionalTicket) => (
              <div
                key={additionalTicket.id}
                className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{additionalTicket.eventTitle}</h3>
                  <p className="text-sm text-gray-600">Ticket Type: {additionalTicket.ticketType}</p>
                </div>
                <Link
                  to={`/tickets/${additionalTicket.id}`}
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-md text-sm hover:bg-teal-200"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketDetailsPage
