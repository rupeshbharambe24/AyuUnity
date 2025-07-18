"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Chatbot } from "@/components/chatbot"

export default function DoctorDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("appointments")
  const [searchQuery, setSearchQuery] = useState("")
  const [prescriptionData, setPrescriptionData] = useState({
    patientName: "",
    patientId: "",
    diagnosis: "",
    medicines: "",
    instructions: "",
    followUp: "",
  })

  // Mock doctor data
  const doctor = {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    email: "sarah.johnson@example.com",
  }

  // Mock appointments data
  const appointments = [
    {
      id: "1",
      patientName: "John Doe",
      patientId: "P12345",
      date: "2025-04-09",
      time: "10:00 AM",
      type: "Video",
      status: "Confirmed",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientId: "P12346",
      date: "2025-04-09",
      time: "11:30 AM",
      type: "OPD",
      status: "Confirmed",
    },
    {
      id: "3",
      patientName: "Robert Brown",
      patientId: "P12347",
      date: "2025-04-10",
      time: "09:15 AM",
      type: "Video",
      status: "Confirmed",
    },
  ]

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setPrescriptionData((prev) => ({ ...prev, [id]: value }))
  }

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!prescriptionData.patientName || !prescriptionData.diagnosis || !prescriptionData.medicines) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    toast({
      title: "Prescription Created",
      description: "The prescription has been saved successfully.",
    })

    // Reset form
    setPrescriptionData({
      patientName: "",
      patientId: "",
      diagnosis: "",
      medicines: "",
      instructions: "",
      followUp: "",
    })
  }

  const handleJoinCall = (appointmentId: string) => {
    toast({
      title: "Joining Video Call",
      description: "Connecting to the video consultation...",
    })
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {doctor.name}</h1>
          <p className="text-muted-foreground">{doctor.specialty} • Manage your appointments and patient records</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patient Lookup</TabsTrigger>
            <TabsTrigger value="prescriptions">Digital Prescription</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>View and manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium">{appointment.patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} • {appointment.time} • {appointment.type}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        {appointment.type === "Video" ? (
                          <Button onClick={() => handleJoinCall(appointment.id)}>Join Call</Button>
                        ) : (
                          <Button variant="outline">Check In</Button>
                        )}
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient History Lookup</CardTitle>
                <CardDescription>Search for patients by Aadhar number or email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search by Aadhar or Email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button>Search</Button>
                  </div>

                  <div className="p-8 text-center text-muted-foreground">
                    Enter a patient's Aadhar number or email to view their medical history
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Digital Prescription</CardTitle>
                <CardDescription>Generate a digital prescription for your patient</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">
                        Patient Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient name"
                        value={prescriptionData.patientName}
                        onChange={handlePrescriptionChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input
                        id="patientId"
                        placeholder="Enter patient ID"
                        value={prescriptionData.patientId}
                        onChange={handlePrescriptionChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">
                      Diagnosis <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Enter diagnosis"
                      value={prescriptionData.diagnosis}
                      onChange={handlePrescriptionChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicines">
                      Medicines <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="medicines"
                      placeholder="Enter medicines with dosage"
                      value={prescriptionData.medicines}
                      onChange={handlePrescriptionChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Enter additional instructions"
                      value={prescriptionData.instructions}
                      onChange={handlePrescriptionChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="followUp">Follow-up</Label>
                    <Input
                      id="followUp"
                      type="date"
                      value={prescriptionData.followUp}
                      onChange={handlePrescriptionChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Fields marked with <span className="text-red-500">*</span> are required
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline">
                      Preview
                    </Button>
                    <Button type="submit">Create Prescription</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
