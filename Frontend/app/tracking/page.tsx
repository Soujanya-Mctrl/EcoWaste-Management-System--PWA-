"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Truck, MapPin, Clock, Route, Fuel, Weight, CheckCircle, AlertCircle, Navigation } from "lucide-react"
import Link from "next/link"

const vehicles = [
  {
    id: "WM-001",
    driver: "Rajesh Kumar",
    route: "Sectors 1-2",
    status: "collecting",
    location: "Sector 1, Block A",
    capacity: 85,
    fuel: 78,
    lastUpdate: "2 min ago",
    todayCollection: 1.2,
    coordinates: { lat: 28.6139, lng: 77.209 },
  },
  {
    id: "WM-002",
    driver: "Amit Singh",
    route: "Sectors 3-4",
    status: "en-route",
    location: "Main Road Junction",
    capacity: 45,
    fuel: 92,
    lastUpdate: "5 min ago",
    todayCollection: 0.8,
    coordinates: { lat: 28.6129, lng: 77.208 },
  },
  {
    id: "WM-003",
    driver: "Priya Sharma",
    route: "Sectors 5-6",
    status: "at-facility",
    location: "Processing Plant A",
    capacity: 12,
    fuel: 65,
    lastUpdate: "1 min ago",
    todayCollection: 1.5,
    coordinates: { lat: 28.6149, lng: 77.207 },
  },
  {
    id: "WM-004",
    driver: "Suresh Patel",
    route: "Commercial Zone",
    status: "maintenance",
    location: "Depot",
    capacity: 0,
    fuel: 45,
    lastUpdate: "30 min ago",
    todayCollection: 0,
    coordinates: { lat: 28.6159, lng: 77.206 },
  },
]

const wasteFlow = [
  {
    stage: "Collection",
    location: "Residential Areas",
    status: "active",
    vehicles: 3,
    volume: "2.8T",
    time: "06:00 - 12:00",
  },
  {
    stage: "Transportation",
    location: "Transfer Stations",
    status: "active",
    vehicles: 2,
    volume: "2.1T",
    time: "12:00 - 14:00",
  },
  {
    stage: "Sorting",
    location: "Processing Facility",
    status: "processing",
    vehicles: 0,
    volume: "1.9T",
    time: "14:00 - 16:00",
  },
  {
    stage: "Treatment",
    location: "Treatment Plants",
    status: "processing",
    vehicles: 0,
    volume: "1.5T",
    time: "16:00 - 18:00",
  },
  {
    stage: "Disposal",
    location: "Final Destination",
    status: "completed",
    vehicles: 0,
    volume: "0.3T",
    time: "18:00 - 20:00",
  },
]

export default function WasteTrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0])
  const [filterStatus, setFilterStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "collecting":
        return "bg-blue-100 text-blue-800"
      case "en-route":
        return "bg-yellow-100 text-yellow-800"
      case "at-facility":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredVehicles = filterStatus === "all" ? vehicles : vehicles.filter((v) => v.status === filterStatus)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-semibold">Waste Tracking System</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">4 Vehicles Active</Badge>
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4 mr-2" />
                Live Map
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Real-Time Waste Tracking</h1>
          <p className="text-muted-foreground">
            Monitor waste collection vehicles, routes, and processing in real-time across all ULBs
          </p>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vehicles">Vehicle Tracking</TabsTrigger>
            <TabsTrigger value="routes">Route Management</TabsTrigger>
            <TabsTrigger value="flow">Waste Flow</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input placeholder="Search by vehicle ID or driver name..." className="w-full" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="collecting">Collecting</SelectItem>
                  <SelectItem value="en-route">En Route</SelectItem>
                  <SelectItem value="at-facility">At Facility</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Vehicle List */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-semibold">Active Vehicles</h2>
                {filteredVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedVehicle.id === vehicle.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{vehicle.id}</CardTitle>
                          <CardDescription>{vehicle.driver}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(vehicle.status)}>{vehicle.status.replace("-", " ")}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Route className="h-3 w-3 text-muted-foreground" />
                          <span>{vehicle.route}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{vehicle.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>Updated {vehicle.lastUpdate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Vehicle Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      {selectedVehicle.id} - Live Status
                    </CardTitle>
                    <CardDescription>Driver: {selectedVehicle.driver}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Weight className="h-6 w-6 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{selectedVehicle.capacity}%</div>
                        <div className="text-sm text-muted-foreground">Capacity</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Fuel className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{selectedVehicle.fuel}%</div>
                        <div className="text-sm text-muted-foreground">Fuel</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Weight className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{selectedVehicle.todayCollection}T</div>
                        <div className="text-sm text-muted-foreground">Collected</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">4.2h</div>
                        <div className="text-sm text-muted-foreground">Active</div>
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Live GPS Tracking</p>
                        <p className="text-sm text-muted-foreground">Current Location: {selectedVehicle.location}</p>
                        <Button className="mt-4">
                          <Navigation className="h-4 w-4 mr-2" />
                          Open Full Map
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button className="flex-1">
                        <Navigation className="h-4 w-4 mr-2" />
                        Track Route
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Contact Driver
                      </Button>
                      <Button variant="outline">View History</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Route Optimization</CardTitle>
                  <CardDescription>AI-powered route planning for maximum efficiency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Route A (Sectors 1-2)</div>
                        <div className="text-sm text-muted-foreground">12.5 km • Est. 3.2 hours</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Optimized</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Route B (Sectors 3-4)</div>
                        <div className="text-sm text-muted-foreground">15.8 km • Est. 4.1 hours</div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Needs Review</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Route C (Sectors 5-6)</div>
                        <div className="text-sm text-muted-foreground">11.2 km • Est. 2.8 hours</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Optimized</Badge>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Route className="h-4 w-4 mr-2" />
                    Optimize All Routes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Schedule</CardTitle>
                  <CardDescription>Daily and weekly collection planning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium mb-2">
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                      <div>Sun</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center text-xs border rounded ${
                            i === 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {i + 15}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Today's Collections</span>
                        <Badge>6 routes active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tomorrow's Schedule</span>
                        <Badge variant="outline">4 routes planned</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="flow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Waste Processing Flow</CardTitle>
                <CardDescription>Track waste from collection to final disposal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {wasteFlow.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            stage.status === "active"
                              ? "bg-blue-100 text-blue-600"
                              : stage.status === "processing"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                          }`}
                        >
                          {stage.status === "completed" ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <AlertCircle className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{stage.stage}</h3>
                            <Badge
                              className={
                                stage.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : stage.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {stage.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <div className="font-medium">{stage.location}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Volume:</span>
                              <div className="font-medium">{stage.volume}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Vehicles:</span>
                              <div className="font-medium">{stage.vehicles} active</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Time:</span>
                              <div className="font-medium">{stage.time}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < wasteFlow.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-6 bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collection Efficiency</CardTitle>
                  <CardDescription>Daily performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">94.5%</div>
                      <div className="text-sm text-muted-foreground">Average Efficiency</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Route Completion</span>
                        <span className="text-sm font-medium">98%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">On-Time Performance</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Fuel Efficiency</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>Sustainability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">2.8T</div>
                        <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">78%</div>
                        <div className="text-xs text-muted-foreground">Recycled</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Waste Diverted from Landfills</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Energy Recovery</span>
                        <span className="font-medium">1,250 kWh</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
