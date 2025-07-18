
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Bone, Heart, Scan } from "lucide-react"

const scanTypes = [
  {
    id: "bone-fracture",
    name: "Bone Fracture",
    description: "Detect fractures in X-ray images",
    icon: Bone,
  },
  {
    id: "brain-tumor",
    name: "Brain Tumor",
    description: "Analyze MRI scans for brain tumors",
    icon: Brain,
  },
  {
    id: "lung-cancer",
    name: "Lung Cancer",
    description: "Screen CT scans for lung cancer",
    icon: Heart,
  },
  {
    id: "renal-malignancy",
    name: "Renal Malignancy",
    description: "Detect kidney malignancies",
    icon: Heart,
  },
  {
    id: "skin-lesions",
    name: "Skin Lesions",
    description: "Analyze skin lesions and moles",
    icon: Heart,
  },
  {
    id: "general-scan",
    name: "General Scan Classification",
    description: "General medical image analysis",
    icon: Scan,
  },
]

export function ScanAnalysisSelector() {
  const [selectedScan, setSelectedScan] = useState<string>("")
  const router = useRouter()

  const handleAnalyze = () => {
    if (selectedScan) {
      router.push(`/scan-analysis/${selectedScan}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scanTypes.map((scanType) => {
          const IconComponent = scanType.icon
          return (
            <Card 
              key={scanType.id} 
              className={`cursor-pointer transition-colors ${
                selectedScan === scanType.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedScan(scanType.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">{scanType.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{scanType.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-col space-y-4">
        <Select value={selectedScan} onValueChange={setSelectedScan}>
          <SelectTrigger>
            <SelectValue placeholder="Select scan type for analysis" />
          </SelectTrigger>
          <SelectContent>
            {scanTypes.map((scanType) => (
              <SelectItem key={scanType.id} value={scanType.id}>
                {scanType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAnalyze} disabled={!selectedScan} className="w-full">
          Start Analysis
        </Button>
      </div>
    </div>
  )
}