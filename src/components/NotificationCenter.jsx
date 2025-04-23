"use client"

import { useContext } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { NotificationContext } from "../App"

const NotificationCenter = () => {
  const { notifications, showNotifications, setShowNotifications } = useContext(NotificationContext)

  if (!showNotifications || notifications.length === 0) return null

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-80 max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
        <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="divide-y">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 hover:bg-gray-50">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">{getIcon(notification.type)}</div>
              <div>
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationCenter
