"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Star, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ state: string, total: number, recyclers: any[] } | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFacilities();
  }, [])

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/facilities");
      // Backend returns { facilities: Facility[], total: number }
      // Each facility has { state, total, recyclers: [] }
      // The current UI expects `result` to be a single object with recyclers.
      // We will flatten all recyclers for the initial view or map the first facility?
      // Let's flatten all recyclers from all facilities to show a comprehensive list initially.
      const facilities = res.data.facilities || [];
      const allRecyclers = facilities.flatMap((f: any) => f.recyclers.map((r: any) => ({
        ...r,
        state: f.state // Add state to recycler for context if needed
      })));

      setResult({
        state: "All Locations",
        total: allRecyclers.length,
        recyclers: allRecyclers
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load facilities.");
    }
    setLoading(false);
  }

  const handleSearch = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await axios.get("http://localhost:4000/facilities/search", {
        params: { query: searchQuery }
      })
      setResult(res.data)
      if (!res.data.recyclers || res.data.recyclers.length === 0) {
        setError("No recyclers found for this address.")
      }
    } catch (err: any) {
      setError("No facilities found or server error.")
      setResult(null)
    }
    setLoading(false)
  }

  // Example placeholder recyclers for empty state
  const placeholderRecyclers = [
    {
      name: "EcoGreen Recycling Center",
      address: "123 Park Street, Kolkata",
      quantity: 1200,
      rating: 4.5
    },
    {
      name: "CleanEarth Facility",
      address: "45 Lake Road, Kolkata",
      quantity: 900,
      rating: 4.2
    },
    {
      name: "Urban Waste Solutions",
      address: "Sector 5, Salt Lake, Kolkata",
      quantity: 1500,
      rating: 4.8
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-semibold">Facility Locator</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recycler Facilities Search</h1>
          <p className="text-muted-foreground">
            Search for recyclers by address (e.g., "Kolkata", "Delhi", etc.)
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Enter address to search recyclers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSearch() }}
            className="max-w-md"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Results */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Show real results if available and not empty */}
        {result && result.recyclers && result.recyclers.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Badge variant="outline">{result.state}</Badge>
              <Badge variant="secondary">{result.total} recyclers found</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.recyclers.map((recycler, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      {recycler.name || "Unnamed Recycler"}
                    </CardTitle>
                    <CardDescription>{recycler.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{recycler.rating ?? "N/A"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Quantity: <span className="font-semibold">{recycler.quantity ?? "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Show placeholder recyclers if no results and not loading */}
        {!loading && (!result || !result.recyclers || result.recyclers.length === 0) && (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Badge variant="outline">Popular in Kolkata</Badge>
              <Badge variant="secondary">{placeholderRecyclers.length} sample recyclers</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placeholderRecyclers.map((recycler, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      {recycler.name}
                    </CardTitle>
                    <CardDescription>{recycler.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{recycler.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Quantity: <span className="font-semibold">{recycler.quantity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center text-muted-foreground mt-8">
              <span>
                Can't find your recycler? Try searching with a different address or contact your local waste management office.
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="py-8 px-4 bg-card border-t mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span>EcoWaste Facility Finder &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/about" className="hover:underline text-muted-foreground">About</Link>
            <Link href="/contact" className="hover:underline text-muted-foreground">Contact</Link>
            <a href="https://swachhbharat.mygov.in/" target="_blank" rel="noopener noreferrer" className="hover:underline text-muted-foreground">
              Swachh Bharat Mission
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}