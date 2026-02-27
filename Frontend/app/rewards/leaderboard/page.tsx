"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, TrendingUp, Crown } from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface LeaderboardUser {
  id: string
  name: string
  points: number
  rank: number
  badge: string
  avatar?: string
}

interface CurrentUser {
  id: string
  rank: number
  points: number
}

export default function LeaderboardPage() {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/leaderboard", { withCredentials: true })
        setTopUsers(response.data.topUsers)
        setCurrentUser(response.data.currentUser)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return null
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case 2:
        return "bg-gray-400/10 text-gray-600 dark:text-gray-400 border-gray-400/20"
      case 3:
        return "bg-amber-600/10 text-amber-600 border-amber-600/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Leaderboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Top eco-warriors in the community</p>
            </div>
            <Link href="/rewards/dashboard">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 whitespace-nowrap">
                View Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top 3 Champions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {/* 2nd Place */}
                {topUsers[1] && (
                  <div className="flex flex-col items-center order-1">
                    <div className="relative mb-2">
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-gray-400">
                        <AvatarImage src={topUsers[1].avatar || "/placeholder.svg"} alt={topUsers[1].name} />
                        <AvatarFallback>
                          {topUsers[1].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
                        <Medal className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <Badge className="mb-1 text-xs bg-gray-400/10 text-gray-600 dark:text-gray-400 border-gray-400/20">
                      #2
                    </Badge>
                    <div className="text-xs sm:text-sm font-medium text-center truncate w-full px-1">
                      {topUsers[1].name}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-primary">{topUsers[1].points}</div>
                  </div>
                )}

                {/* 1st Place */}
                {topUsers[0] && (
                  <div className="flex flex-col items-center order-2">
                    <div className="relative mb-2">
                      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-yellow-500">
                        <AvatarImage src={topUsers[0].avatar || "/placeholder.svg"} alt={topUsers[0].name} />
                        <AvatarFallback>
                          {topUsers[0].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1.5">
                        <Crown className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <Badge className="mb-1 text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20">#1</Badge>
                    <div className="text-xs sm:text-sm font-medium text-center truncate w-full px-1">
                      {topUsers[0].name}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-primary">{topUsers[0].points}</div>
                  </div>
                )}

                {/* 3rd Place */}
                {topUsers[2] && (
                  <div className="flex flex-col items-center order-3">
                    <div className="relative mb-2">
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-amber-600">
                        <AvatarImage src={topUsers[2].avatar || "/placeholder.svg"} alt={topUsers[2].name} />
                        <AvatarFallback>
                          {topUsers[2].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 bg-amber-600 rounded-full p-1">
                        <Medal className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <Badge className="mb-1 text-xs bg-amber-600/10 text-amber-600 border-amber-600/20">#3</Badge>
                    <div className="text-xs sm:text-sm font-medium text-center truncate w-full px-1">
                      {topUsers[2].name}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-primary">{topUsers[2].points}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top 10 Rankings
            </CardTitle>
            <CardDescription>Complete leaderboard standings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topUsers.map((user) => {
                const isCurrentUser = currentUser?.id === user.id
                const rankIcon = getRankIcon(user.rank)

                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isCurrentUser
                      ? "bg-primary/10 border-primary shadow-md ring-2 ring-primary/20"
                      : "bg-card hover:bg-muted/50"
                      }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 flex-shrink-0">
                      {rankIcon ? (
                        rankIcon
                      ) : (
                        <Badge variant="outline" className={`${getRankBadgeColor(user.rank)} font-bold`}>
                          #{user.rank}
                        </Badge>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm truncate">{user.name}</div>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.badge}</div>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-primary">{user.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current User Position (if not in top 10) */}
        {currentUser && currentUser.rank > 10 && (
          <Card className="mt-6 border-primary">
            <CardHeader>
              <CardTitle className="text-lg">Your Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                <Badge variant="outline" className="font-bold">
                  #{currentUser.rank}
                </Badge>
                <div className="flex-1">
                  <div className="font-medium">You</div>
                  <div className="text-sm text-muted-foreground">Keep earning points to climb the leaderboard!</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{currentUser.points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="mt-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Climb the Leaderboard!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Earn more points by participating in eco-friendly activities and redeeming rewards
            </p>
            <Link href="/rewards">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Browse Rewards
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
