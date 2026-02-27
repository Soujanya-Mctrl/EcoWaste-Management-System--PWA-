"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Search, Star, Truck, Shield, Recycle, Home, BookOpen, Plus, Minus, Heart } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "3-Bin Waste Segregation Set",
    category: "dustbins",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 245,
    image: "/colorful-waste-segregation-bins.jpg",
    description: "Color-coded 3-bin system for dry, wet, and hazardous waste segregation",
    features: ["Color-coded lids", "40L capacity each", "Durable plastic", "Easy to clean"],
    inStock: true,
    bestseller: true,
  },
  {
    id: 2,
    name: "Home Composting Kit Pro",
    category: "composting",
    price: 2499,
    originalPrice: 2999,
    rating: 4.6,
    reviews: 189,
    image: "/home-composting-kit-with-bins.jpg",
    description: "Complete composting solution with bins, activator, and detailed guide",
    features: ["2-tier composting bin", "Organic activator", "Instruction manual", "Maintenance tools"],
    inStock: true,
    bestseller: false,
  },
  {
    id: 3,
    name: "Waste Worker Safety Kit",
    category: "safety",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 156,
    image: "/safety-equipment-gloves-mask.jpg",
    description: "Essential safety equipment for waste handling workers",
    features: ["Heavy-duty gloves", "N95 masks", "Safety goggles", "Reflective vest"],
    inStock: true,
    bestseller: false,
  },
  {
    id: 4,
    name: "Educational Waste Management Kit",
    category: "educational",
    price: 599,
    originalPrice: 799,
    rating: 4.5,
    reviews: 98,
    image: "/educational-materials-books-posters.jpg",
    description: "Learning materials for schools and community training programs",
    features: ["Training posters", "Activity booklets", "Stickers", "Progress charts"],
    inStock: true,
    bestseller: false,
  },
  {
    id: 5,
    name: "Smart Compost Bin",
    category: "composting",
    price: 3999,
    originalPrice: 4999,
    rating: 4.9,
    reviews: 67,
    image: "/smart-composting-bin-with-sensors.jpg",
    description: "IoT-enabled composting bin with temperature and moisture monitoring",
    features: ["Smart sensors", "Mobile app", "Auto-mixing", "Weather resistant"],
    inStock: false,
    bestseller: false,
  },
  {
    id: 6,
    name: "Recycling Storage Containers",
    category: "dustbins",
    price: 799,
    originalPrice: 999,
    rating: 4.4,
    reviews: 134,
    image: "/recycling-storage-containers-plastic.jpg",
    description: "Stackable containers for different recyclable materials",
    features: ["Stackable design", "Clear labeling", "20L capacity", "Set of 4"],
    inStock: true,
    bestseller: false,
  },
]

const categories = [
  { value: "all", label: "All Products", icon: ShoppingCart, count: 6 },
  { value: "dustbins", label: "Dustbins & Containers", icon: Recycle, count: 2 },
  { value: "composting", label: "Composting Kits", icon: Home, count: 2 },
  { value: "safety", label: "Safety Equipment", icon: Shield, count: 1 },
  { value: "educational", label: "Educational Materials", icon: BookOpen, count: 1 },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [wishlist, setWishlist] = useState<number[]>([])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (productId: number) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId]--
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const cartItemsCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [productId, count]) => {
    const product = products.find((p) => p.id === Number.parseInt(productId))
    return sum + (product?.price || 0) * count
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="font-semibold">Waste Utilities Shop</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">Free Delivery</Badge>
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cartItemsCount})
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Waste Management Utilities</h1>
          <p className="text-muted-foreground">
            Shop for compost kits, dustbins, safety equipment, and educational materials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.label}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {category.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      {product.bestseller && (
                        <Badge className="absolute top-2 left-2 bg-orange-100 text-orange-800">Bestseller</Badge>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="mt-2">{product.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    </div>

                    {/* Features */}
                    <div className="space-y-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                      )}
                      {product.originalPrice > product.price && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                      {product.inStock ? (
                        <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Truck className="h-3 w-3" />
                        <span>Free delivery</span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="flex gap-2">
                      {cart[product.id] ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeFromCart(product.id)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium px-3">{cart[product.id]}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => addToCart(product.id)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => addToCart(product.id)} disabled={!product.inStock} className="flex-1">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                      <Button variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
                <CardDescription>Review your selected items before checkout</CardDescription>
              </CardHeader>
              <CardContent>
                {cartItemsCount === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Your cart is empty</p>
                    <Button onClick={() => setSelectedCategory("all")}>Continue Shopping</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(cart).map(([productId, count]) => {
                      const product = products.find((p) => p.id === Number.parseInt(productId))
                      if (!product) return null
                      return (
                        <div key={productId} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">₹{product.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeFromCart(product.id)}
                              className="h-8 w-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium px-3">{count}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => addToCart(product.id)}
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">₹{product.price * count}</div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total: ₹{cartTotal}</span>
                        <Button size="lg">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Proceed to Checkout
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track your previous orders and deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Order #WM-2024-001</div>
                      <div className="text-sm text-muted-foreground">3-Bin Waste Segregation Set • ₹1,299</div>
                      <div className="text-sm text-muted-foreground">Ordered on March 15, 2024</div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                      <div className="text-sm text-muted-foreground mt-1">March 18, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Order #WM-2024-002</div>
                      <div className="text-sm text-muted-foreground">Home Composting Kit Pro • ₹2,499</div>
                      <div className="text-sm text-muted-foreground">Ordered on March 20, 2024</div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
                      <div className="text-sm text-muted-foreground mt-1">Expected: March 23, 2024</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
