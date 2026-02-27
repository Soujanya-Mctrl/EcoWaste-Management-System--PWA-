"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Gift, ShoppingBag, Leaf, Package, Award, Star, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  stock: number
  category: string
  image: string
}

interface UserPoints {
  points: number
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [userPoints, setUserPoints] = useState<UserPoints>({ points: 450 })
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simulating API call
    const fetchRewards = async () => {
      try {
        // Mock data - replace with actual API call: GET /api/rewards
        const mockRewards: Reward[] = [
          {
            id: "r1",
            name: "Reusable Shopping Bag",
            description: "Eco-friendly cotton shopping bag to reduce plastic waste",
            cost: 50,
            stock: 25,
            category: "Daily Use",
            image: "/reusable-shopping-bag.png",
          },
          {
            id: "r2",
            name: "Compost Bin",
            description: "Home composting bin for organic waste management",
            cost: 100,
            stock: 15,
            category: "Home",
            image: "/outdoor-compost-bin.png",
          },
          {
            id: "r3",
            name: "Eco-Friendly Water Bottle",
            description: "Stainless steel water bottle to reduce single-use plastic",
            cost: 75,
            stock: 30,
            category: "Daily Use",
            image: "/reusable-water-bottle.png",
          },
          {
            id: "r4",
            name: "Solar Garden Light",
            description: "Solar-powered LED light for sustainable outdoor lighting",
            cost: 150,
            stock: 10,
            category: "Garden",
            image: "/solar-garden-light.jpg",
          },
          {
            id: "r5",
            name: "Bamboo Cutlery Set",
            description: "Portable bamboo cutlery set for zero-waste dining",
            cost: 60,
            stock: 20,
            category: "Daily Use",
            image: "/bamboo-cutlery.jpg",
          },
          {
            id: "r6",
            name: "Seed Starter Kit",
            description: "Organic seed starter kit for home gardening",
            cost: 80,
            stock: 0,
            category: "Garden",
            image: "/seed-starter-kit.jpg",
          },
          {
            id: "r7",
            name: "Recycled Notebook",
            description: "100% recycled paper notebook for eco-conscious writing",
            cost: 40,
            stock: 50,
            category: "Stationery",
            image: "/recycled-notebook.jpg",
          },
          {
            id: "r8",
            name: "Eco Cleaning Kit",
            description: "Natural cleaning products kit for chemical-free home",
            cost: 120,
            stock: 12,
            category: "Home",
            image: "/eco-cleaning-products.jpg",
          },
        ]
        setRewards(mockRewards)
      } catch (error) {
        console.error("Error fetching rewards:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRewards()
  }, [])

  const handleRedeem = async (reward: Reward) => {
    if (userPoints.points < reward.cost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.cost - userPoints.points} more points to redeem this reward.`,
        variant: "destructive",
      })
      return
    }

    if (reward.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This reward is currently out of stock. Please check back later.",
        variant: "destructive",
      })
      return
    }

    setRedeeming(reward.id)

    try {
      // Simulate API call: POST /api/redeem
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user points
      setUserPoints({ points: userPoints.points - reward.cost })

      // Update reward stock
      setRewards(
        rewards.map((r) =>
          r.id === reward.id
            ? {
              ...r,
              stock: r.stock - 1,
            }
            : r,
        ),
      )

      toast({
        title: "Reward Redeemed Successfully!",
        description: `You've redeemed ${reward.name} for ${reward.cost} points. Check your dashboard for details.`,
        className: "bg-green-500 text-white border-green-600",
      })
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRedeeming(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Daily Use":
        return ShoppingBag
      case "Home":
        return Package
      case "Garden":
        return Leaf
      case "Stationery":
        return Star
      default:
        return Gift
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rewards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary text-xl hidden sm:inline-block">EcoWaste</span>
            </Link>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium mr-2">
                <Link href="/rewards/dashboard" className="transition-colors hover:text-primary text-foreground/60">Dashboard</Link>
                <Link href="/rewards/leaderboard" className="transition-colors hover:text-primary text-foreground/60">Leaderboard</Link>
                <Link href="/rewards/history" className="transition-colors hover:text-primary text-foreground/60">History</Link>
              </nav>

              {/* Profile Section */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Green Citizen</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Rewards Marketplace</h1>
              <p className="text-sm text-muted-foreground mt-1">Redeem your eco-points for sustainable rewards</p>
            </div>
            <div className="flex items-center gap-3">
              <Card className="flex-1 sm:flex-none">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Your Points</div>
                      <div className="text-xl font-bold text-primary">{userPoints.points}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Link href="/rewards/dashboard">
                <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rewards.map((reward) => {
            const CategoryIcon = getCategoryIcon(reward.category)
            const canRedeem = userPoints.points >= reward.cost && reward.stock > 0
            const isRedeeming = redeeming === reward.id

            return (
              <Card key={reward.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.name}
                      className="object-cover w-full h-full"
                    />
                    {reward.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{reward.name}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
                      <CategoryIcon className="h-3 w-3" />
                      <span className="text-xs">{reward.category}</span>
                    </Badge>
                  </div>
                  <CardDescription className="text-xs line-clamp-2">{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">{reward.cost}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{reward.stock} left</div>
                      <div className="text-xs text-muted-foreground">in stock</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    disabled={!canRedeem || isRedeeming}
                    onClick={() => handleRedeem(reward)}
                    size="sm"
                  >
                    {isRedeeming ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Redeeming...
                      </>
                    ) : !canRedeem && userPoints.points < reward.cost ? (
                      `Need ${reward.cost - userPoints.points} more points`
                    ) : !canRedeem && reward.stock === 0 ? (
                      "Out of Stock"
                    ) : (
                      "Redeem Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {rewards.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Rewards Available</h3>
            <p className="text-muted-foreground">Check back later for new rewards!</p>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
