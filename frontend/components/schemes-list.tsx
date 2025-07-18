"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"

type Scheme = {
  id: string
  title: string
  description: string
  eligibility: string
  provider: string
  type: string
}

export function SchemesList() {
  const { toast } = useToast()
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    type: "",
    provider: "",
  })

  // Mock schemes data
  const schemes: Scheme[] = [
    {
      id: "1",
      title: "Ayushman Bharat",
      description: "Comprehensive healthcare coverage for eligible families.",
      eligibility: "Families below poverty line, senior citizens",
      provider: "Government",
      type: "Insurance",
    },
    {
      id: "2",
      title: "Medical Support Program",
      description: "Financial assistance for critical illnesses and surgeries.",
      eligibility: "Low income families, children under 12",
      provider: "NGO",
      type: "Financial Aid",
    },
    {
      id: "3",
      title: "Senior Citizen Health Scheme",
      description: "Specialized healthcare benefits for senior citizens.",
      eligibility: "Citizens above 60 years of age",
      provider: "Government",
      type: "Insurance",
    },
    {
      id: "4",
      title: "Rural Health Initiative",
      description: "Healthcare services for rural communities with limited access.",
      eligibility: "Residents of designated rural areas",
      provider: "NGO",
      type: "Service",
    },
  ]

  const filteredSchemes = schemes.filter((scheme) => {
    if (filters.type && scheme.type !== filters.type) return false
    if (filters.provider && scheme.provider !== filters.provider) return false
    return true
  })

  const handleApply = () => {
    if (!selectedScheme) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setApplyDialogOpen(false)

      toast({
        title: "Application Submitted",
        description: `Your application for ${selectedScheme.title} has been submitted successfully.`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="filter-type" className="mb-2 block">
            Filter by Type
          </Label>
          <Select value={filters.type} onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
              <SelectItem value="Financial Aid">Financial Aid</SelectItem>
              <SelectItem value="Service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="filter-provider" className="mb-2 block">
            Filter by Provider
          </Label>
          <Select
            value={filters.provider}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, provider: value }))}
          >
            <SelectTrigger id="filter-provider">
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="NGO">NGO</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{scheme.title}</CardTitle>
                  <CardDescription>Provider: {scheme.provider}</CardDescription>
                </div>
                <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">{scheme.type}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{scheme.description}</p>
              <p className="text-sm text-muted-foreground">
                <strong>Eligibility:</strong> {scheme.eligibility}
              </p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedScheme(scheme)} className="w-full">
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Apply for {selectedScheme?.title}</DialogTitle>
                    <DialogDescription>Fill in your details to apply for this healthcare scheme.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" placeholder="Enter your full name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="aadhar">Aadhar Number</Label>
                      <Input id="aadhar" placeholder="Enter your 12-digit Aadhar number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Enter your address" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleApply} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <h3 className="text-lg font-medium">No Schemes Found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  )
}
