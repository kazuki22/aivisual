import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading...</span>
    </div>
  )
}

export default LoadingSpinner