"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const scanTypeConfig = {
  "bone-fracture": {
    title: "Bone Fracture Detection",
    description: "Upload X-ray images to detect bone fractures",
    acceptedFormats: "X-ray images (JPEG, PNG)",
  },
  "brain-tumor": {
    title: "Brain Tumor Detection",
    description: "Upload MRI scans to analyze for brain tumors",
    acceptedFormats: "MRI scans (JPEG, PNG, DICOM)",
  },
  "lung-cancer": {
    title: "Lung Cancer Screening",
    description: "Upload CT scans for lung cancer analysis",
    acceptedFormats: "CT scans (JPEG, PNG, DICOM)",
  },
  "renal-malignancy": {
    title: "Renal Malignancy Detection",
    description: "Upload kidney scans to detect malignancies",
    acceptedFormats: "CT/MRI scans (JPEG, PNG, DICOM)",
  },
  "skin-lesions": {
    title: "Skin Lesion Analysis",
    description: "Upload skin images to analyze lesions and moles",
    acceptedFormats: "High-resolution images (JPEG, PNG)",
  },
  "general-scan": {
    title: "General Scan Classification",
    description: "Upload any medical scan for general analysis",
    acceptedFormats: "Medical images (JPEG, PNG, DICOM)",
  },
}

interface AnalysisResult {
  prediction: string
  confidence: number
  severity: "normal" | "abnormal" | "requires-attention"
  details: string
  disease_info: string  // Add this line
  recommendations: string[]
}

export default function ScanAnalysis() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AnalysisResult | null>(null)

  const category = params?.category as string
  const config = category ? scanTypeConfig[category as keyof typeof scanTypeConfig] : null

  if (!config) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-6">
            <p>Invalid scan category</p>
            <Button onClick={() => router.push("/patient-dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResults(null)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

const handleAnalyze = async () => {
  if (!selectedFile) {
    toast({
      title: "No File Selected",
      description: "Please select a scan image to analyze.",
      variant: "destructive",
    });
    return;
  }

  setIsAnalyzing(true);
  setProgress(0);
  setResults(null);

  const progressInterval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) {
        clearInterval(progressInterval);
        return prev;
      }
      return prev + 10;
    });
  }, 300);

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(`http://localhost:5000/analyze/${category}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || "Analysis failed");
    }

    const data = await response.json();
    
    setResults({
      prediction: data.prediction,
      confidence: data.confidence,
      severity: data.severity,
      details: data.details,
      disease_info: data.disease_info,
      recommendations: data.recommendations,
    });

    setProgress(100);
    toast({
      title: "Analysis Complete",
      description: "Your scan has been analyzed successfully.",
    });
  } catch (error) {
    console.error("Analysis failed:", error);
    setProgress(0);
    
    let errorMessage = "Analysis failed";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Handle specific model loading errors
      if (error.message.includes("size mismatch")) {
        errorMessage = "Model architecture mismatch. Please check your model files.";
      }
    }

    setResults({
      prediction: "Analysis Error",
      confidence: 0,
      severity: "normal",
      details: errorMessage,
      disease_info: "No information available due to analysis failure",
      recommendations: [
        "Try uploading the scan again",
        "Check your internet connection",
        "Contact support if the problem persists",
      ],
    });

    toast({
      title: "Analysis Failed",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    clearInterval(progressInterval);
    setIsAnalyzing(false);
  }
};

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "normal":
        return "text-green-600"
      case "abnormal":
        return "text-red-600"
      case "requires-attention":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "abnormal":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "requires-attention":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/patient-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Scan Image</Label>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: {config.acceptedFormats}
                </p>
              </div>

              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={handleUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.dcm"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={previewUrl} 
                      alt="Selected scan" 
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Click to upload scan</p>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop or click to select files
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={!selectedFile || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Scan"}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Processing your scan...</p>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>

            {results && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Analysis Results</CardTitle>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(results.severity)}
                      <span className={`font-medium ${getSeverityColor(results.severity)}`}>
                        {results.confidence.toFixed(2)}% confidence
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-lg">{results.prediction}</h4>
                    {/* Add disease information section */}
                    <div className="my-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-muted-foreground">{results.disease_info}</p>
                    </div>
                    <p className="text-muted-foreground">{results.details}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {results.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Important Notice</p>
                        <p className="text-sm text-yellow-700">
                          This AI analysis is for informational purposes only and should not replace professional medical diagnosis. 
                          Please consult with a qualified healthcare provider or radiologist for definitive interpretation.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}