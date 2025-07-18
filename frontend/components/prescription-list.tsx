"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText } from "lucide-react"

type Prescription = {
  id: string
  doctorName: string
  date: string
  diagnosis: string
  fileUrl: string
}

export function PrescriptionList() {
  const { toast } = useToast()

  // Mock prescriptions data
  const prescriptions: Prescription[] = [
    {
      id: "1",
      doctorName: "Dr. Sarah Johnson",
      date: "2025-04-01",
      diagnosis: "Hypertension",
      fileUrl: "#",
    },
    {
      id: "2",
      doctorName: "Dr. Michael Brown",
      date: "2025-03-15",
      diagnosis: "Seasonal Allergies",
      fileUrl: "#",
    },
    {
      id: "3",
      doctorName: "Dr. Lisa Thompson",
      date: "2025-02-22",
      diagnosis: "Migraine",
      fileUrl: "#",
    },
  ]

  const handleDownload = (prescriptionId: string) => {
    toast({
      title: "Downloading Prescription",
      description: "Your prescription is being downloaded.",
    })
  }

  return (
    <div className="space-y-4">
      {prescriptions.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">{prescription.doctorName}</TableCell>
                  <TableCell>{new Date(prescription.date).toLocaleDateString()}</TableCell>
                  <TableCell>{prescription.diagnosis}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(prescription.id)}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Prescriptions Yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Your prescriptions will appear here after consultations.</p>
        </div>
      )}
    </div>
  )
}
