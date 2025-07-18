"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Chatbot } from "@/components/chatbot"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [role, setRole] = useState("patient")
  const [aadhar, setAadhar] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpDialogOpen, setOtpDialogOpen] = useState(false)
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (role === "patient") {
      // Validate Aadhar (simple validation for demo)
      if (aadhar.length !== 12 || !/^\d+$/.test(aadhar)) {
        toast({
          title: "Invalid Aadhar",
          description: "Please enter a valid 12-digit Aadhar number.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Show OTP dialog for patient login
      setTimeout(() => {
        setIsSubmitting(false)
        setOtpDialogOpen(true)
      }, 1000)
    } else {
      // Doctor login with email/password
      if (!email || !password) {
        toast({
          title: "Missing Fields",
          description: "Please enter both email and password.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Simulate API call for doctor login
      setTimeout(() => {
        setIsSubmitting(false)
        toast({
          title: "Login Successful",
          description: "Welcome back, Doctor!",
        })
        router.push("/doctor-dashboard")
      }, 1500)
    }
  }

  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate OTP verification
    setTimeout(() => {
      setIsSubmitting(false)
      setOtpDialogOpen(false)
      toast({
        title: "Login Successful",
        description: "Welcome to AyuUnity!",
      })
      router.push("/patient-dashboard")
    }, 1500)
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "patient" ? (
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input
                  id="aadhar"
                  type="text"
                  placeholder="Enter your 12-digit Aadhar number"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  maxLength={12}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register-patient" className="text-primary hover:underline">
              Register as a patient
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>We&apos;ve sent a one-time password to your registered mobile number.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleVerifyOtp} disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify & Login"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
