"use client"

import { useState, useRef } from "react"
import { ImageIcon } from "lucide-react"

const ImageUploader = ({ initialImage, onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState(initialImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result)
        onImageChange(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result)
        onImageChange(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div
      className={`border-2 border-dashed ${
        isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300"
      } rounded-md p-6 flex flex-col items-center cursor-pointer transition-colors`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {previewUrl ? (
        <div className="w-full mb-4">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Event banner preview"
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      ) : (
        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
      )}

      <p className="text-sm text-gray-500 mb-4">
        {previewUrl ? "Click to change image" : "Drag and drop an image, or click to select a file"}
      </p>
      <p className="text-xs text-gray-400 mb-4">Recommended size: 1200 x 600 pixels</p>

      <button
        type="button"
        className="py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {previewUrl ? "Change Image" : "Select Image"}
      </button>
    </div>
  )
}

export default ImageUploader
