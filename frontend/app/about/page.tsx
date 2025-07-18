import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Chatbot } from "@/components/chatbot"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">About AyuUnity</h1>
          <p className="text-xl text-muted-foreground">Revolutionizing healthcare through technology</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              At AyuUnity, our mission is to make quality healthcare accessible to everyone, regardless of their
              location or economic status. We believe that technology can bridge the gap between patients and healthcare
              providers, making healthcare more efficient, affordable, and convenient.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Vision</h2>
            <p className="text-muted-foreground">
              We envision a world where everyone has access to quality healthcare services. Through our telemedicine
              platform, we aim to connect patients with doctors, facilitate timely consultations, and provide
              comprehensive healthcare solutions that improve health outcomes for all.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Approach</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Patient-Centered Care</h3>
                <p className="text-sm text-muted-foreground">
                  We put patients at the center of everything we do, designing our platform to be intuitive, accessible,
                  and responsive to their needs.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Technology-Driven Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  We leverage cutting-edge technology, including AI and machine learning, to enhance the healthcare
                  experience for both patients and providers.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Collaborative Healthcare</h3>
                <p className="text-sm text-muted-foreground">
                  We foster collaboration between patients, doctors, and healthcare institutions to create a seamless
                  healthcare ecosystem.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Inclusive Design</h3>
                <p className="text-sm text-muted-foreground">
                  We design our platform to be accessible to all, including those with disabilities and those in remote
                  or underserved areas.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Impact</h2>
            <p className="text-muted-foreground">Since our inception, we have:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Connected thousands of patients with qualified healthcare providers</li>
              <li>Facilitated over 10,000 virtual consultations</li>
              <li>Reduced the average time to receive medical advice by 70%</li>
              <li>Expanded healthcare access to over 100 rural communities</li>
              <li>Partnered with 50+ hospitals and 200+ doctors across the country</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Join Us</h2>
            <p className="text-muted-foreground">
              Whether you're a patient seeking quality healthcare or a healthcare provider looking to expand your reach,
              AyuUnity offers a platform that connects, empowers, and transforms healthcare delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild size="lg">
                <Link href="/register-patient">Register as a Patient</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
