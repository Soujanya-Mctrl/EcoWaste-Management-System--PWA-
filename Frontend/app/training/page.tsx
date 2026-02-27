"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Recycle, Home, Shield, Download, PlayCircle } from "lucide-react"
import Link from "next/link"

const trainingTopics = [
  {
    id: 1,
    title: "Waste Types & Classification",
    description: "Learn about different types of waste and how to identify them properly",
    icon: BookOpen,
    content: [
      "Dry Waste: Paper, plastic, metal, glass",
      "Wet Waste: Food scraps, garden waste, organic matter",
      "Hazardous Waste: Batteries, chemicals, medical waste",
      "E-Waste: Electronics, computers, mobile phones",
    ],
  },
  {
    id: 2,
    title: "3-Bin Segregation System",
    description: "Simple guide to separating waste at home using three bins",
    icon: Recycle,
    content: [
      "Green Bin: Wet/Organic waste only",
      "Blue Bin: Dry recyclable waste",
      "Red Bin: Hazardous and non-recyclable waste",
      "Keep bins clean and covered",
    ],
  },
  {
    id: 3,
    title: "Home Composting",
    description: "Turn your kitchen waste into nutrient-rich compost",
    icon: Home,
    content: [
      "Use a composting bin or pit",
      "Add brown (dry) and green (wet) materials",
      "Turn the compost regularly",
      "Ready compost in 2-3 months",
    ],
  },
  {
    id: 4,
    title: "Safety Guidelines",
    description: "Stay safe while handling different types of waste",
    icon: Shield,
    content: [
      "Always wear gloves when handling waste",
      "Wash hands thoroughly after waste handling",
      "Keep hazardous waste separate and labeled",
      "Never mix chemicals or unknown substances",
    ],
  },
]

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-semibold">Waste Management Training</span>
            </Link>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Guide
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learn Waste Management</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple guides to help you manage waste effectively at home and contribute to a cleaner environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {trainingTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <Card key={topic.id} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-base">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {topic.content.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full bg-transparent">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Watch Video Guide
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Reference Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Printable guide with waste segregation tips and bin colors.
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Composting Manual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Step-by-step guide to start composting at home.</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Essential safety measures for waste handling.</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
