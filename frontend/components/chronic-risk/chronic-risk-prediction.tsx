
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface RiskAssessmentData {
  age: string
  bmi: string
  cholesterol: string
  triglycerides: string
  hdl: string
  ldl: string
  creatinine: string
  bun: string
  gender: string
}

interface RiskResults {
  heartDisease: number
  kidneyDisease: number
  diabetes: number
  advice: {
    heartDisease: string
    kidneyDisease: string
    diabetes: string
  }
}

export function ChronicRiskPrediction() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<RiskAssessmentData>({
    age: "",
    bmi: "",
    cholesterol: "",
    triglycerides: "",
    hdl: "",
    ldl: "",
    creatinine: "",
    bun: "",
    gender: "",
  })
  const [results, setResults] = useState<RiskResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof RiskAssessmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Validate form
  const requiredFields = Object.entries(formData)
  const missingFields = requiredFields.filter(([key, value]) => !value)
  
  if (missingFields.length > 0) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields.",
      variant: "destructive",
    })
    setIsLoading(false)
    return
  }

  try {
    const response = await fetch('http://localhost:5000/predict-chronic-risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: formData.age,
        gender: formData.gender,
        bmi: formData.bmi,
        cholesterol: formData.cholesterol,
        triglycerides: formData.triglycerides,
        hdl: formData.hdl,
        ldl: formData.ldl,
        creatinine: formData.creatinine,
        bun: formData.bun
      })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    
    setResults({
      heartDisease: data.heart_disease.percentage,
      kidneyDisease: data.kidney_disease.percentage,
      diabetes: data.diabetes.percentage,
      advice: {
        heartDisease: data.advice.heart_disease,
        kidneyDisease: data.advice.kidney_disease,
        diabetes: data.advice.diabetes
      }
    })

    toast({
      title: "Risk Assessment Complete",
      description: "Your chronic disease risk assessment has been calculated.",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to calculate risk assessment. Please try again.",
      variant: "destructive",
    })
    console.error('Error:', error)
  } finally {
    setIsLoading(false)
  }
}

  const getRiskLevel = (percentage: number) => {
    if (percentage < 15) return { level: "Low", color: "text-green-600" }
    if (percentage < 30) return { level: "Moderate", color: "text-yellow-600" }
    return { level: "High", color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bmi">BMI (kg/m²)</Label>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              placeholder="Enter your BMI"
              value={formData.bmi}
              onChange={(e) => handleInputChange("bmi", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
            <Input
              id="cholesterol"
              type="number"
              placeholder="Enter cholesterol level"
              value={formData.cholesterol}
              onChange={(e) => handleInputChange("cholesterol", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="triglycerides">Triglycerides (mg/dL)</Label>
            <Input
              id="triglycerides"
              type="number"
              placeholder="Enter triglycerides level"
              value={formData.triglycerides}
              onChange={(e) => handleInputChange("triglycerides", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
            <Input
              id="hdl"
              type="number"
              placeholder="Enter HDL level"
              value={formData.hdl}
              onChange={(e) => handleInputChange("hdl", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ldl">LDL Cholesterol (mg/dL)</Label>
            <Input
              id="ldl"
              type="number"
              placeholder="Enter LDL level"
              value={formData.ldl}
              onChange={(e) => handleInputChange("ldl", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
            <Input
              id="creatinine"
              type="number"
              step="0.01"
              placeholder="Enter creatinine level"
              value={formData.creatinine}
              onChange={(e) => handleInputChange("creatinine", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bun">BUN - Blood Urea Nitrogen (mg/dL)</Label>
            <Input
              id="bun"
              type="number"
              placeholder="Enter BUN level"
              value={formData.bun}
              onChange={(e) => handleInputChange("bun", e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Analyzing..." : "Calculate Risk Assessment"}
        </Button>
      </form>

      {results && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Risk Assessment Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Heart Disease", risk: results.heartDisease, advice: results.advice.heartDisease },
              { name: "Kidney Disease", risk: results.kidneyDisease, advice: results.advice.kidneyDisease },
              { name: "Diabetes", risk: results.diabetes, advice: results.advice.diabetes },
            ].map((disease) => {
              const riskInfo = getRiskLevel(disease.risk)
              return (
                <Card key={disease.name}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{disease.name}</CardTitle>
                    <CardDescription className={`text-lg font-semibold ${riskInfo.color}`}>
                      {disease.risk}% Risk ({riskInfo.level})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={disease.risk} className="mb-3" />
                    <p className="text-sm text-muted-foreground">{disease.advice}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
