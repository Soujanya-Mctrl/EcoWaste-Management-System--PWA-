"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  MapPin,
  Truck,
  Recycle,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Camera,
  Award,
  Bell,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GreenChampionsDashboard() {
  const [selectedSector, setSelectedSector] = useState("all")
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [areaStats, setAreaStats] = useState<any>(null)
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [wasteCollectionData, setWasteCollectionData] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setAreaStats(data.areaStats)
        setRecentAlerts(data.recentAlerts)
        setWasteCollectionData(data.wasteCollectionData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading Live Dashboard Data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              <span className="font-semibold">Green Champions Dashboard</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">Area Champion</Badge>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts (3)
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Green Champions Monitoring Center</h1>
          <p className="text-muted-foreground">
            Decentralized waste management monitoring for Area Committee Zone 12-A
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Households</span>
              </div>
              <div className="text-2xl font-bold">{areaStats.totalHouseholds}</div>
              <div className="text-xs text-muted-foreground">
                {areaStats.trainedHouseholds} trained (
                {Math.round((areaStats.trainedHouseholds / areaStats.totalHouseholds) * 100)}%)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Compliance</span>
              </div>
              <div className="text-2xl font-bold">{areaStats.segregationCompliance}%</div>
              <div className="text-xs text-green-600">+2% from last week</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Collected</span>
              </div>
              <div className="text-2xl font-bold">{areaStats.wasteCollected}T</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Recycle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Recycling</span>
              </div>
              <div className="text-2xl font-bold">{areaStats.recyclingRate}%</div>
              <div className="text-xs text-primary">+5% this month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Issues</span>
              </div>
              <div className="text-2xl font-bold">17</div>
              <div className="text-xs text-orange-600">3 pending</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">

            <TabsTrigger value="collection">Collection Status</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>

          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Alerts */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <Alert key={alert.id} className={alert.type === "warning" ? "border-orange-200" : ""}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="text-sm">{alert.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{alert.time}</span>
                              <Badge
                                variant={alert.status === "pending" ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {alert.status}
                              </Badge>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sector Overview */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sector-wise Monitoring</CardTitle>
                    <CardDescription>Real-time waste management status across all sectors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {wasteCollectionData.map((sector) => (
                        <div key={sector.area} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="font-medium">{sector.area}</span>
                              <Badge variant="outline">{sector.households} households</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {sector.issues > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {sector.issues} issues
                                </Badge>
                              )}
                              <Badge variant={sector.compliance >= 95 ? "default" : "secondary"} className="text-xs">
                                {sector.compliance}% compliance
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Compliance Rate</span>
                              <Progress value={sector.compliance} className="mt-1" />
                            </div>
                            <div>
                              <span className="text-muted-foreground">Waste Collected</span>
                              <div className="font-medium mt-1">{sector.collected}T today</div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Camera className="h-3 w-3 mr-1" />
                                Photos
                              </Button>
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    Collection Vehicles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Vehicle WM-001</div>
                        <div className="text-sm text-muted-foreground">Route: Sectors 1-2</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Vehicle WM-002</div>
                        <div className="text-sm text-muted-foreground">Route: Sectors 3-4</div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">En Route</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Vehicle WM-003</div>
                        <div className="text-sm text-muted-foreground">Route: Sectors 5-6</div>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Collection Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                          className={`aspect-square flex items-center justify-center text-xs border rounded ${i === 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                        >
                          {i + 15}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-primary rounded"></div>
                        <span>Today - All sectors collection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-muted rounded"></div>
                        <span>Regular collection days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Photo Reports</CardTitle>
                  <CardDescription>Geo-tagged photos from community members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Illegal Dumping Site</span>
                        <Badge variant="destructive">High Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reported by: Citizen #1247 • Location: Near Park Gate
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="h-3 w-3 mr-1" />
                          View Photos
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          Location
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Excellent Segregation</span>
                        <Badge className="bg-green-100 text-green-800">Positive</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reported by: Green Champion #45 • Location: Sector 3, Block B
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="h-3 w-3 mr-1" />
                          View Photos
                        </Button>
                        <Button variant="outline" size="sm">
                          Recognize
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Weekly and monthly performance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Weekly Compliance Rate</span>
                        <span className="text-sm font-bold text-primary">94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Collection Efficiency</span>
                        <span className="text-sm font-bold text-primary">97%</span>
                      </div>
                      <Progress value={97} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Citizen Participation</span>
                        <span className="text-sm font-bold text-primary">89%</span>
                      </div>
                      <Progress value={89} />
                    </div>
                    <div className="pt-4 border-t">
                      <Button className="w-full " onClick={() => router.push("/report")}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Generate Your Problems Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Progress</CardTitle>
                  <CardDescription>Monitor citizen training completion across sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wasteCollectionData.map((sector) => (
                      <div key={sector.area} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{sector.area}</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(sector.households * 0.9)} / {sector.households} trained
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {Math.round(((sector.households * 0.9) / sector.households) * 100)}%
                          </div>
                          <Progress value={((sector.households * 0.9) / sector.households) * 100} className="w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Training Sessions</CardTitle>
                  <CardDescription>Scheduled training for new residents and refresher courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">New Resident Orientation</span>
                        <Badge variant="outline">Tomorrow</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Sector 2 Community Hall • 10:00 AM</p>
                      <p className="text-sm text-muted-foreground">Expected: 25 participants</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Composting Workshop</span>
                        <Badge variant="outline">This Weekend</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Central Park • 9:00 AM</p>
                      <p className="text-sm text-muted-foreground">Expected: 50 participants</p>
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
