
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chatbot } from "@/components/chatbot"
import { AppointmentBooking } from "@/components/appointment-booking"
import { ReportUploader } from "@/components/report-uploader"
import { PrescriptionList } from "@/components/prescription-list"
import { SchemesList } from "@/components/schemes-list"
import { VideoConsultation } from "@/components/video-consultation"
import { ScanAnalysisSelector } from "@/components/scan-analysis/scan-analysis-selector"
import { ChronicRiskPrediction } from "@/components/chronic-risk/chronic-risk-prediction"
import { SymptomChecker } from "@/components/symptom-checker/symptom-checker"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("appointments")

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    aadhar: "123456789012",
    phone: "9876543210",
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Manage your appointments, reports, and prescriptions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="px-5 py-3 text-base font-medium rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black hover:bg-white/10">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="consultations">Consult Now</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="schemes">Schemes</TabsTrigger>
            <TabsTrigger value="scan-analysis">Scan Analysis</TabsTrigger>
            <TabsTrigger value="chronic-risk">Chronic Risk</TabsTrigger>
            <TabsTrigger value="symptom-checker">Symptom Checker</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
                <CardDescription>Schedule an appointment with a specialist</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentBooking />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Reports</CardTitle>
                <CardDescription>Upload and manage your medical reports</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Video Consultation</CardTitle>
                <CardDescription>Connect with your doctor through video call</CardDescription>
              </CardHeader>
              <CardContent>
                <VideoConsultation />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>View and download your prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <PrescriptionList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schemes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Government & NGO Schemes</CardTitle>
                <CardDescription>Explore healthcare schemes you may be eligible for</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scan-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Scan Analysis</CardTitle>
                <CardDescription>Analyze MRI, CT scans, and other medical images using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ScanAnalysisSelector />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chronic-risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chronic Disease Risk Assessment</CardTitle>
                <CardDescription>Evaluate your risk for chronic diseases based on health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChronicRiskPrediction />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptom-checker" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Symptom-Based Disease Prediction</CardTitle>
                <CardDescription>Check your symptoms and get possible diagnoses</CardDescription>
              </CardHeader>
              <CardContent>
                <SymptomChecker />
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
