
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Send, AlertCircle, Heart, Pill, Activity, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const EmergencyPage = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock patient data - in real app this would come from backend
  const patientData = {
    personalInfo: {
      name: "John Doe",
      age: 45,
      gender: "Male",
      bloodType: "O+",
      weight: "75 kg",
      height: "175 cm",
      emergencyContact: "+1-555-0123",
      address: "123 Main St, City, State 12345"
    },
    medicalHistory: [
      { condition: "Hypertension", diagnosedDate: "2020-03-15", status: "Ongoing" },
      { condition: "Type 2 Diabetes", diagnosedDate: "2019-08-22", status: "Controlled" },
      { condition: "Appendectomy", diagnosedDate: "2015-06-10", status: "Resolved" }
    ],
    currentMedications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribedBy: "Dr. Smith" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribedBy: "Dr. Johnson" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily", prescribedBy: "Dr. Smith" }
    ],
    allergies: [
      { allergen: "Penicillin", reaction: "Severe rash", severity: "High" },
      { allergen: "Shellfish", reaction: "Anaphylaxis", severity: "Critical" },
      { allergen: "Pollen", reaction: "Rhinitis", severity: "Mild" }
    ],
    vitalSigns: {
      bloodPressure: "140/90 mmHg",
      heartRate: "78 bpm",
      temperature: "98.6°F",
      respiratoryRate: "16/min",
      oxygenSaturation: "98%",
      lastUpdated: "2024-01-15 10:30 AM"
    },
    recentTests: [
      { test: "Blood Glucose", result: "126 mg/dL", date: "2024-01-10", status: "Elevated" },
      { test: "Cholesterol", result: "195 mg/dL", date: "2024-01-08", status: "Normal" },
      { test: "HbA1c", result: "7.2%", date: "2024-01-05", status: "Fair Control" }
    ],
    immunizations: [
      { vaccine: "COVID-19", date: "2023-09-15", booster: "Yes" },
      { vaccine: "Influenza", date: "2023-10-01", booster: "Annual" },
      { vaccine: "Tetanus", date: "2021-03-20", booster: "Due 2026" }
    ]
  };

  const generatePDF = async () => {
    const element = document.getElementById('emergency-data');
    if (!element) return null;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf;
  };

  const handleSendEmergencyData = async () => {
    setIsSending(true);
    
    try {
      const pdf = await generatePDF();
      if (pdf) {
        // In real app, this would send to hospital's system
        // For now, we'll simulate the sending process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Emergency Data Sent",
          description: "Your medical information has been sent to the emergency services.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send emergency data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.save(`emergency-medical-data-${patientData.personalInfo.name.replace(/\s+/g, '-')}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-red-700">Emergency Medical Data</h1>
                <p className="text-red-600">Critical Patient Information</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button
              onClick={handleSendEmergencyData}
              disabled={isSending}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Sending..." : "Send Emergency Data"}
            </Button>
          </div>
        </div>

        {/* Emergency Data Content */}
        <div id="emergency-data" className="bg-white p-8 rounded-lg shadow-lg">
          {/* Patient Info Header */}
          <div className="text-center mb-8 border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">EMERGENCY MEDICAL RECORD</h2>
            <div className="text-lg font-semibold text-red-600">
              {patientData.personalInfo.name} • {patientData.personalInfo.age} years • {patientData.personalInfo.gender}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Generated on {new Date().toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <FileText className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div><strong>Blood Type:</strong> <Badge variant="destructive">{patientData.personalInfo.bloodType}</Badge></div>
                  <div><strong>Weight:</strong> {patientData.personalInfo.weight}</div>
                  <div><strong>Height:</strong> {patientData.personalInfo.height}</div>
                  <div><strong>Emergency Contact:</strong> {patientData.personalInfo.emergencyContact}</div>
                  <div><strong>Address:</strong> {patientData.personalInfo.address}</div>
                </div>
              </CardContent>
            </Card>

            {/* Current Vital Signs */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Activity className="h-5 w-5" />
                  Current Vital Signs
                </CardTitle>
                <CardDescription>Last updated: {patientData.vitalSigns.lastUpdated}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div><strong>Blood Pressure:</strong> {patientData.vitalSigns.bloodPressure}</div>
                  <div><strong>Heart Rate:</strong> {patientData.vitalSigns.heartRate}</div>
                  <div><strong>Temperature:</strong> {patientData.vitalSigns.temperature}</div>
                  <div><strong>Respiratory Rate:</strong> {patientData.vitalSigns.respiratoryRate}</div>
                  <div><strong>Oxygen Saturation:</strong> {patientData.vitalSigns.oxygenSaturation}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Critical Allergies */}
          <Card className="border-orange-200 mb-6">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-5 w-5" />
                CRITICAL ALLERGIES
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {patientData.allergies.map((allergy, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-orange-50">
                    <div className="font-semibold text-orange-800">{allergy.allergen}</div>
                    <div className="text-sm text-gray-600">{allergy.reaction}</div>
                    <Badge 
                      variant={allergy.severity === 'Critical' ? 'destructive' : 
                              allergy.severity === 'High' ? 'secondary' : 'outline'}
                      className="mt-2"
                    >
                      {allergy.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="border-green-200 mb-6">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Pill className="h-5 w-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {patientData.currentMedications.map((medication, index) => (
                  <div key={index} className="border-l-4 border-green-400 pl-4 py-2">
                    <div className="font-semibold">{medication.name} - {medication.dosage}</div>
                    <div className="text-sm text-gray-600">
                      {medication.frequency} • Prescribed by {medication.prescribedBy}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="border-purple-200 mb-6">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Heart className="h-5 w-5" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {patientData.medicalHistory.map((condition, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-semibold">{condition.condition}</div>
                      <div className="text-sm text-gray-600">Diagnosed: {condition.diagnosedDate}</div>
                    </div>
                    <Badge variant={condition.status === 'Ongoing' ? 'destructive' : 'secondary'}>
                      {condition.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tests */}
          <Card className="border-gray-200 mb-6">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-700">Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {patientData.recentTests.map((test, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{test.test}:</span> {test.result}
                      <span className="text-sm text-gray-500 ml-2">({test.date})</span>
                    </div>
                    <Badge variant={test.status === 'Normal' ? 'secondary' : 'outline'}>
                      {test.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Immunizations */}
          <Card className="border-indigo-200">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700">Immunization Record</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {patientData.immunizations.map((vaccine, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{vaccine.vaccine}</span>
                      <span className="text-sm text-gray-500 ml-2">({vaccine.date})</span>
                    </div>
                    <span className="text-sm text-gray-600">{vaccine.booster}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t text-sm text-gray-500">
            <p>This document contains confidential medical information.</p>
            <p>For emergency use only. Contact emergency services immediately if needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
