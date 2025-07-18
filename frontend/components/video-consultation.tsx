"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, Video } from "lucide-react"

export function VideoConsultation() {
  const { toast } = useToast()
  const [isJoining, setIsJoining] = useState(false)
  const [isInCall, setIsInCall] = useState(false)

  // Mock upcoming appointment
  const upcomingAppointment = {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "2025-04-09",
    time: "10:00 AM",
    status: "Confirmed",
  }

  const handleJoinCall = () => {
    setIsJoining(true)

    // Simulate joining call
    setTimeout(() => {
      setIsJoining(false)
      setIsInCall(true)

      toast({
        title: "Video Call Started",
        description: `You are now connected with ${upcomingAppointment.doctorName}.`,
      })
    }, 2000)
  }

  const handleEndCall = () => {
    setIsInCall(false)

    toast({
      title: "Call Ended",
      description: "Your video consultation has ended.",
    })
  }

  return (
    <div>
      {isInCall ? (
        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="h-16 w-16 text-white opacity-20" />
            </div>
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border border-gray-700">
              {/* Self view */}
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button variant="destructive" onClick={handleEndCall} className="px-8">
                End Call
              </Button>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium">Currently in consultation with:</h3>
            <p>
              {upcomingAppointment.doctorName} ({upcomingAppointment.specialty})
            </p>
          </div>
        </div>
      ) : (
        <div>
          {upcomingAppointment ? (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Video Consultation</CardTitle>
                <CardDescription>Join your scheduled video consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{upcomingAppointment.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">{upcomingAppointment.specialty}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(upcomingAppointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{upcomingAppointment.time}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleJoinCall} className="w-full" disabled={isJoining}>
                  {isJoining ? "Connecting..." : "Join Video Call"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
              <Video className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No Upcoming Consultations</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You don't have any upcoming video consultations scheduled.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <a href="/patient-dashboard?tab=appointments">Book Consultation</a>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
