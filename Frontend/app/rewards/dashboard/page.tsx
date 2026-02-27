"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Award, Leaf, Star, Calendar, Package, Home, TrendingUp, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

interface UserData {
  id: string
  name: string
  email: string
  points: number
  badge: string
  history: RedemptionHistory[]
}

interface RedemptionHistory {
  id: string
  rewardName: string
  pointsCost: number
  date: string
}

export default function RewardsDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/user", { withCredentials: true })
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/logout", {}, { withCredentials: true })
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const getBadgeInfo = (points: number) => {
    if (points >= 500) {
      return { name: "Eco Leader", icon: Trophy, color: "text-yellow-500", bgColor: "bg-yellow-500/10" }
    } else if (points >= 250) {
      return { name: "Eco Warrior", icon: Award, color: "text-blue-500", bgColor: "bg-blue-500/10" }
    } else if (points >= 100) {
      return { name: "Eco Helper", icon: Leaf, color: "text-green-500", bgColor: "bg-green-500/10" }
    }
    return { name: "Eco Beginner", icon: Star, color: "text-gray-500", bgColor: "bg-gray-500/10" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your rewards dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Data</CardTitle>
            <CardDescription>Unable to load your rewards information. Please try again later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const badgeInfo = getBadgeInfo(userData.points)
  const BadgeIcon = badgeInfo.icon

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Rewards Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your eco-points and rewards</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/rewards/leaderboard">
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <TrendingUp className="h-5 w-5" />
                <span className="sr-only">Leaderboard</span>
              </button>
            </Link>
            <Link href="/">
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md border border-input bg-transparent hover:bg-destructive hover:text-destructive-foreground h-10 w-10"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={userData.name} />
                  <AvatarFallback className="text-lg">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">{userData.name}</CardTitle>
                  <CardDescription className="text-sm">{userData.email}</CardDescription>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="text-3xl font-bold text-primary sm:text-4xl">{userData.points}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Badge Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Your Badge</CardTitle>
            <CardDescription>Earn more points to unlock higher badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Current Badge */}
              <div className={`flex items-center gap-4 p-4 rounded-lg ${badgeInfo.bgColor}`}>
                <BadgeIcon className={`h-12 w-12 ${badgeInfo.color}`} />
                <div>
                  <div className="font-semibold text-lg">{badgeInfo.name}</div>
                  <div className="text-sm text-muted-foreground">{userData.points} points earned</div>
                </div>
              </div>

              {/* Badge Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress to next badge</span>
                  <span className="font-medium">
                    {userData.points >= 500
                      ? "Max Level!"
                      : `${userData.points}/${userData.points >= 250 ? "500" : userData.points >= 100 ? "250" : "100"}`}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${userData.points >= 500 ? 100 : userData.points >= 250 ? ((userData.points - 250) / 250) * 100 : userData.points >= 100 ? ((userData.points - 100) / 150) * 100 : (userData.points / 100) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* All Badges */}
                <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
                  <div
                    className={`p-3 rounded-lg border text-center ${userData.points >= 100 ? "border-green-500 bg-green-500/10" : "border-border bg-muted/50"}`}
                  >
                    <Leaf
                      className={`h-6 w-6 mx-auto mb-1 ${userData.points >= 100 ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <div className="text-xs font-medium">Eco Helper</div>
                    <div className="text-xs text-muted-foreground">100+ pts</div>
                  </div>
                  <div
                    className={`p-3 rounded-lg border text-center ${userData.points >= 250 ? "border-blue-500 bg-blue-500/10" : "border-border bg-muted/50"}`}
                  >
                    <Award
                      className={`h-6 w-6 mx-auto mb-1 ${userData.points >= 250 ? "text-blue-500" : "text-muted-foreground"}`}
                    />
                    <div className="text-xs font-medium">Eco Warrior</div>
                    <div className="text-xs text-muted-foreground">250+ pts</div>
                  </div>
                  <div
                    className={`p-3 rounded-lg border text-center ${userData.points >= 500 ? "border-yellow-500 bg-yellow-500/10" : "border-border bg-muted/50"}`}
                  >
                    <Trophy
                      className={`h-6 w-6 mx-auto mb-1 ${userData.points >= 500 ? "text-yellow-500" : "text-muted-foreground"}`}
                    />
                    <div className="text-xs font-medium">Eco Leader</div>
                    <div className="text-xs text-muted-foreground">500+ pts</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/50 text-center">
                    <Star className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-xs font-medium">Coming Soon</div>
                    <div className="text-xs text-muted-foreground">???</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redemption History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl">Redemption History</CardTitle>
                <CardDescription>Your recent reward redemptions</CardDescription>
              </div>
              <Link
                href="/rewards/history"
                className="text-sm text-primary hover:underline font-medium whitespace-nowrap"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {userData.history.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No redemptions yet</p>
                <Link
                  href="/rewards"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Explore Rewards
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userData.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{item.rewardName}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0 ml-2">
                      -{item.pointsCost} pts
                    </Badge>
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
