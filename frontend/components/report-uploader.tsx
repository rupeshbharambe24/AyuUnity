"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText, Upload } from "lucide-react"

type Report = {
  id: string
  name: string
  type: string
  date: string
  fileUrl: string
}

export function ReportUploader() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [reportName, setReportName] = useState("")
  const [reportType, setReportType] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Blood Test Report",
      type: "Laboratory",
      date: "2025-03-15",
      fileUrl: "#",
    },
    {
      id: "2",
      name: "Chest X-Ray",
      type: "Radiology",
      date: "2025-02-28",
      fileUrl: "#",
    },
    {
      id: "3",
      name: "ECG Report",
      type: "Cardiology",
      date: "2025-01-10",
      fileUrl: "#",
    },
  ])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!reportName || !reportType || !selectedFile) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate file upload
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        name: reportName,
        type: reportType,
        date: new Date().toISOString().split("T")[0],
        fileUrl: "#",
      }

      setReports((prev) => [newReport, ...prev])
      setIsUploading(false)
      setUploadDialogOpen(false)
      setReportName("")
      setReportType("")
      setSelectedFile(null)

      toast({
        title: "Report Uploaded",
        description: "Your medical report has been uploaded successfully.",
      })
    }, 2000)
  }

  const handleDownload = (reportId: string) => {
    toast({
      title: "Downloading Report",
      description: "Your report is being downloaded.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Reports</h3>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Medical Report</DialogTitle>
              <DialogDescription>
                Upload your medical reports for easy access and sharing with your doctors.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-file">Upload File</Label>
                <Input id="report-file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, JPEG, PNG (Max size: 10MB)</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {reports.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(report.id)}>
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
          <h3 className="text-lg font-medium">No Reports Yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your medical reports to keep track of your health records.
          </p>
        </div>
      )}
    </div>
  )
}
