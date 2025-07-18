"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmergencyButton } from "@/components/emergency-button"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isPatientDashboard = pathname?.startsWith("/patient-dashboard")
  const isDoctorDashboard = pathname?.startsWith("/doctor-dashboard")
  const isAuthenticated = isPatientDashboard || isDoctorDashboard

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const authLinks = isAuthenticated
    ? [
        { name: "Dashboard", href: isPatientDashboard ? "/patient-dashboard" : "/doctor-dashboard" },
        { name: "Logout", href: "/logout" },
      ]
    : [
        { name: "Login", href: "/login" },
        { name: "Register", href: "/register-patient" },
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="text-xl font-bold text-primary">AyuUnity</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 px-2 pt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-3 py-2 text-lg transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="h-px bg-border" />
                {authLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-3 py-2 text-lg transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold inline-block">AyuUnity</span>
          </Link>
        </div>
        <nav className="hidden gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated && <EmergencyButton />}
          <div className="hidden lg:flex gap-2">
            {authLinks.map((item) => (
              <Button key={item.name} variant={item.name === "Login" ? "default" : "outline"} asChild>
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
