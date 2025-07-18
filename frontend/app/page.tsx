import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Chatbot } from "@/components/chatbot"
import { CalendarClock, Video, FileText, MessageSquare, ShieldAlert, Stethoscope } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Modern Healthcare at Your Fingertips
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Connect with doctors, book appointments, and manage your health records all in one place. Our
                telemedicine platform makes healthcare accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/register-patient">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 w-full max-w-[500px] aspect-video rounded-xl overflow-hidden">
              <img
                src="/landing-image.jpg?height=500&width=800"
                alt="Telemedicine platform interface"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comprehensive Healthcare Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Our platform offers a wide range of features to make healthcare more accessible and convenient.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <CalendarClock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Appointment Booking</h3>
              <p className="text-center text-muted-foreground">
                Book OPD appointments with specialists based on your schedule.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Video Consultations</h3>
              <p className="text-center text-muted-foreground">
                Connect with doctors remotely through secure video calls.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Digital Prescriptions</h3>
              <p className="text-center text-muted-foreground">
                Receive and manage digital prescriptions from your doctors.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Chatbot</h3>
              <p className="text-center text-muted-foreground">
                Get instant answers to your health queries in multiple languages.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Emergency Access</h3>
              <p className="text-center text-muted-foreground">
                Quick access to emergency services with medical record sharing.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Health Records</h3>
              <p className="text-center text-muted-foreground">
                Securely store and access your medical reports and history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Experience Modern Healthcare?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed">
                Join thousands of patients and doctors who are already using our platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register-patient">Sign Up Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
