"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, ShoppingCart, Award, Leaf, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false) // Not strictly needed if we just want to avoid redirect loop
  // const router = useRouter(); // Router not needed for forceful redirect anymore

  // Check auth status (optional: can be used to show/hide "Login" vs "Dashboard" buttons)
  // useEffect(() => {
  //   axios.get("http://localhost:4000/verify", { withCredentials: true })
  //     .then(() => setIsLoggedIn(true))
  //     .catch(() => setIsLoggedIn(false))
  // }, [])

  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:4000/verify", { withCredentials: true })
        setIsLoggedIn(true)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              <h1 className="text-base font-bold text-primary sm:text-lg md:text-xl">EcoWaste</h1>
            </div>

            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <Link
                href="/training"
                className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                Training
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/facilities"
                className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                Facilities
              </Link>
              <Link
                href="/shop"
                className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                Shop
              </Link>
              <Link
                href="/rewards/dashboard"
                className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                Profile
              </Link>
              <ThemeToggle />
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="sm" className="whitespace-nowrap">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="whitespace-nowrap">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 pb-3 border-t pt-3">
              <div className="flex flex-col space-y-2">
                <Link
                  href="/training"
                  className="text-foreground hover:text-primary transition-colors py-2 text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Training
                </Link>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-primary transition-colors py-2 text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/facilities"
                  className="text-foreground hover:text-primary transition-colors py-2 text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Facilities
                </Link>
                <Link
                  href="/shop"
                  className="text-foreground hover:text-primary transition-colors py-2 text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/rewards"
                  className="text-foreground hover:text-primary transition-colors py-2 text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rewards
                </Link>
                {isLoggedIn ? (
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full mt-2" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full mt-2" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="py-8 px-3 sm:py-12 sm:px-6 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-3 text-xs px-2 py-1" variant="secondary">
            Mandatory Waste Management Training
          </Badge>
          <h1 className="text-2xl font-bold mb-4 text-balance leading-tight sm:text-3xl lg:text-4xl xl:text-5xl">
            Building a <span className="text-primary">Sustainable Future</span> Together
          </h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl mx-auto text-pretty sm:text-base lg:text-lg">
            Join India's comprehensive waste management system with mandatory training, community monitoring, and smart
            facility tracking for every citizen.
          </p>
          <div className="flex flex-col gap-2 justify-center sm:flex-row sm:gap-3">
            <Button size="default" className="w-full sm:w-auto" onClick={() => router.push('/training')}>
              Start Training Now
            </Button>
            <Button size="default" variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => router.push('/facilities')}>
              View Facilities
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 px-3 bg-muted/30 sm:py-12 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6 sm:text-2xl lg:text-3xl">
            Complete Waste Management Ecosystem
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base sm:text-lg">Citizen Training</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Mandatory training on waste segregation, composting, and sustainable practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm space-y-1">
                  <li>• Source segregation training</li>
                  <li>• Home composting kits</li>
                  <li>• 3-bin distribution system</li>
                  <li>• App-based monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base sm:text-lg">Green Champions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Decentralized monitoring system with trained community leaders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm space-y-1">
                  <li>• Area committee formation</li>
                  <li>• Waste collection monitoring</li>
                  <li>• Transportation tracking</li>
                  <li>• Treatment oversight</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base sm:text-lg">Facility Tracking</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Complete network of waste management facilities in every ULB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm space-y-1">
                  <li>• Biomethanization plants</li>
                  <li>• Waste-to-Energy facilities</li>
                  <li>• Recycling centers</li>
                  <li>• Scrap collection points</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base sm:text-lg">Utility Shopping</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Online marketplace for waste management tools and equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm space-y-1">
                  <li>• Compost making kits</li>
                  <li>• Segregation dustbins</li>
                  <li>• Safety equipment</li>
                  <li>• Educational materials</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 px-3 sm:py-12 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-6">
            <div>
              <div className="text-2xl font-bold text-primary mb-1 sm:text-3xl">100%</div>
              <div className="text-xs text-muted-foreground sm:text-sm">Citizen Coverage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1 sm:text-3xl">24/7</div>
              <div className="text-xs text-muted-foreground sm:text-sm">Monitoring System</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1 sm:text-3xl">Zero</div>
              <div className="text-xs text-muted-foreground sm:text-sm">Waste to Landfills</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1 sm:text-3xl">Smart</div>
              <div className="text-xs text-muted-foreground sm:text-sm">Digital Platform</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-3 bg-primary text-primary-foreground sm:py-12 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-3 sm:text-2xl lg:text-3xl">Ready to Make a Difference?</h2>
          <p className="text-sm mb-6 opacity-90 sm:text-base lg:text-lg">
            Join millions of citizens in building a cleaner, greener India
          </p>
          <div className="flex flex-col gap-2 justify-center sm:flex-row sm:gap-3">
            <Button size="default" variant="secondary" className="w-full sm:w-auto" onClick={() => router.push('/training')}>
              Begin Training
            </Button>
            <Button
              size="default"
              variant="outline"
              className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Download App
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-6 px-3 bg-card border-t sm:py-8 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="h-4 w-4 text-primary" />
                <span className="font-bold text-primary text-sm">EcoWaste Manager</span>
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                India's comprehensive waste management system for a sustainable future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Training</h3>
              <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>
                  <Link href="/training/citizens">Citizen Training</Link>
                </li>
                <li>
                  <Link href="/training/workers">Worker Training</Link>
                </li>
                <li>
                  <Link href="/training/champions">Green Champions</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Facilities</h3>
              <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>
                  <Link href="/facilities/map">Facility Map</Link>
                </li>
                <li>
                  <Link href="/facilities/recycling">Recycling Centers</Link>
                </li>
                <li>
                  <Link href="/facilities/collection">Collection Points</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Community</h3>
              <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>
                  <Link href="/community/report">Report Issues</Link>
                </li>
                <li>
                  <Link href="/community/events">Events</Link>
                </li>
                <li>
                  <Link href="/community/forum">Discussion Forum</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-4 pt-4 text-center text-xs text-muted-foreground sm:mt-6 sm:pt-6 sm:text-sm">
            <p>&copy; 2025 EcoWaste Manager. Building a sustainable India together.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
