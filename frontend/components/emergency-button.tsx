
"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function EmergencyButton() {
  const router = useRouter()

  const handleEmergencyClick = () => {
    router.push('/emergency')
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleEmergencyClick} 
      className="bg-red-600 hover:bg-red-700"
    >
      <AlertCircle className="mr-2 h-4 w-4" />
      Emergency
    </Button>
  )
}
