"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Calendar, ArrowLeft, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

interface RedemptionItem {
  id: string
  rewardName: string
  pointsCost: number
  date: string
  status: "completed" | "pending" | "shipped"
  trackingNumber?: string
  category: string
}

export default function RedemptionHistoryPage() {
  const [history, setHistory] = useState<RedemptionItem[]>([])
  const [filteredHistory, setFilteredHistory] = useState<RedemptionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    // Simulating API call
    const fetchHistory = async () => {
      try {
        // Mock data - replace with actual API call: GET /api/rewards/history
        const mockData: RedemptionItem[] = [
          {
            id: "r1",
            rewardName: "Reusable Shopping Bag",
            pointsCost: 50,
            date: "2025-01-15",
            status: "completed",
            trackingNumber: "TRK123456789",
            category: "Eco Products",
          },
          {
            id: "r2",
            rewardName: "Outdoor Compost Bin",
            pointsCost: 100,
            date: "2025-01-10",
            status: "shipped",
            trackingNumber: "TRK987654321",
            category: "Composting",
          },
          {
            id: "r3",
            rewardName: "Eco-Friendly Water Bottle",
            pointsCost: 75,
            date: "2025-01-05",
            status: "completed",
            category: "Eco Products",
          },
          {
            id: "r4",
            rewardName: "Solar Garden Light",
            pointsCost: 150,
            date: "2024-12-28",
            status: "completed",
            category: "Solar Products",
          },
          {
            id: "r5",
            rewardName: "Bamboo Cutlery Set",
            pointsCost: 60,
            date: "2024-12-20",
            status: "completed",
            category: "Eco Products",
          },
          {
            id: "r6",
            rewardName: "Seed Starter Kit",
            pointsCost: 80,
            date: "2024-12-15",
            status: "completed",
            category: "Gardening",
          },
          {
            id: "r7",
            rewardName: "Recycled Notebook Set",
            pointsCost: 40,
            date: "2024-12-10",
            status: "completed",
            category: "Stationery",
          },
          {
            id: "r8",
            rewardName: "Eco Cleaning Products",
            pointsCost: 90,
            date: "2024-12-05",
            status: "completed",
            category: "Cleaning",
          },
        ]
        setHistory(mockData)
        setFilteredHistory(mockData)
      } catch (error) {
        console.error("Error fetching history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  useEffect(() => {
    let filtered = history

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) => item.rewardName.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    setFilteredHistory(filtered)
  }, [searchQuery, filterStatus, history])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const totalPointsSpent = history.reduce((sum, item) => sum + item.pointsCost, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your redemption history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/rewards/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Redemption History</h1>
          <p className="text-sm text-muted-foreground mt-1">View all your reward redemptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Redemptions</CardDescription>
              <CardTitle className="text-3xl">{history.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Points Spent</CardDescription>
              <CardTitle className="text-3xl">{totalPointsSpent}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Shipments</CardDescription>
              <CardTitle className="text-3xl">{history.filter((item) => item.status === "shipped").length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search rewards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("completed")}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={filterStatus === "shipped" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("shipped")}
                  >
                    Shipped
                  </Button>
                  <Button
                    variant={filterStatus === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle>All Redemptions</CardTitle>
            <CardDescription>
              {filteredHistory.length} {filteredHistory.length === 1 ? "redemption" : "redemptions"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== "all" ? "No redemptions match your filters" : "No redemptions yet"}
                </p>
                <Link href="/rewards">
                  <Button>Explore Rewards</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base mb-1">{item.rewardName}</div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {item.trackingNumber && (
                          <div className="text-xs text-muted-foreground">
                            Tracking: <span className="font-mono">{item.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <Badge className={`${getStatusColor(item.status)} capitalize`}>{item.status}</Badge>
                      <Badge variant="secondary" className="font-semibold">
                        -{item.pointsCost} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
