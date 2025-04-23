const QRCode = ({ value }) => {
    // In a real app, you would use a QR code library
    // For this demo, we'll just show a placeholder
    return (
      <div className="flex flex-col items-center">
        <div className="bg-gray-200 w-32 h-32 flex items-center justify-center">
          <div className="text-xs text-center text-gray-600 p-2">QR Code: {value}</div>
        </div>
        <p className="mt-2 text-xs text-gray-500">Scan at the event</p>
      </div>
    )
  }
  
  export default QRCode
  