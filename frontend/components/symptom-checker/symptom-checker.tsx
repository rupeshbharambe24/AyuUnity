
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"

interface PredictionResult {
  disease: string
  confidence: number
  severity: "low" | "moderate" | "high"
  description: string
  recommendations: string[]
}

const commonSymptoms = [
  "Fever", "Headache", "Cough", "Fatigue", "Nausea", "Vomiting", 
  "Diarrhea", "Muscle aches", "Sore throat", "Runny nose", 
  "Shortness of breath", "Chest pain", "Abdominal pain", "Dizziness"
]

export function SymptomChecker() {
  const { toast } = useToast()
  const [symptoms, setSymptoms] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [results, setResults] = useState<PredictionResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

const handlePredict = async () => {
  const allSymptoms = [...selectedSymptoms, ...symptoms.split(',').map(s => s.trim()).filter(s => s)]
  
  if (allSymptoms.length === 0) {
    toast({
      title: "No Symptoms Selected",
      description: "Please select or enter at least one symptom.",
      variant: "destructive",
    })
    return
  }

  setIsLoading(true)

  try {
    const response = await fetch('http://localhost:5000/check-symptoms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms: allSymptoms.join(', ')
      })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    
    // Format the response to match your frontend interface
    setResults([{
      disease: data.disease,
      confidence: 85, // You might want to get this from your model
      severity: data.severity,
      description: data.description,
      recommendations: data.recommendations
    }])

    toast({
      title: "Analysis Complete",
      description: "Your symptoms have been analyzed. Please consult a healthcare provider for proper diagnosis.",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to analyze symptoms. Please try again.",
      variant: "destructive",
    })
    console.error('Error:', error)
  } finally {
    setIsLoading(false)
  }
}

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "moderate":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-600"
      case "moderate":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Common Symptoms (click to select)</Label>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <Badge
                key={symptom}
                variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleSymptomToggle(symptom)}
              >
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-symptoms">Additional Symptoms (comma-separated)</Label>
          <Textarea
            id="additional-symptoms"
            placeholder="Enter any additional symptoms you're experiencing..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={handlePredict} disabled={isLoading} className="w-full">
          {isLoading ? "Analyzing Symptoms..." : "Check Symptoms"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Possible Conditions</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This tool is for informational purposes only and should not replace professional medical advice. 
            Please consult with a healthcare provider for proper diagnosis and treatment.
          </p>

          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{result.disease}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(result.severity)}
                      <span className={`text-sm font-medium ${getSeverityColor(result.severity)}`}>
                        {result.confidence}% match
                      </span>
                    </div>
                  </div>
                  <CardDescription>{result.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {result.recommendations.map((rec, recIndex) => (
                        <li key={recIndex}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
