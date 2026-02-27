"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Camera,
  MapPin,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Star,
  ArrowLeft,
  Calendar,
  MapPinIcon,
  ImageIcon,
  Bot,
  FileText,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"
const reportCategories = [
  { value: "illegal-dumping", label: "Illegal Dumping", priority: "high" },
  { value: "overflowing-bins", label: "Overflowing Bins", priority: "medium" },
  { value: "missed-collection", label: "Missed Collection", priority: "medium" },
  { value: "non-segregation", label: "Non-Segregation", priority: "low" },
  { value: "facility-issue", label: "Facility Issue", priority: "high" },
  { value: "positive-example", label: "Positive Example", priority: "low" },
]

// --- Types ---
type BackendReport = {
  _id: string
  image: string
  content: string
  user?: string
  username?: string
  location?: string
  title?: string
  description?: string
  status?: string
  createdAt?: string
}

type CommunityReport = {
  id: string
  title: string
  description: string
  location: string
  photos: number
  votes: number
  status: string
  priority: string
  reporter: string
  timestamp: string
}

type SubmittedReport = {
  id: string
  timestamp: string
  category: string
  title: string
  description: string
  location: string
  photos: string[]
  aiDetection: {
    wasteTypes: string[]
    confidence: number
    recyclable: boolean
    hazardous: boolean
  }
}

// --- Helpers ---
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "investigating":
      return "bg-blue-100 text-blue-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    case "verified":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-orange-100 text-orange-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// --- Main Component ---
export default function ReportingPage() {
  // --- State ---
  const [recentReports, setRecentReports] = useState<CommunityReport[]>([])
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null)
  const [showSubmittedReport, setShowSubmittedReport] = useState(false)
  const [submittedReportData, setSubmittedReportData] = useState<SubmittedReport | null>(null)
  const [reportForm, setReportForm] = useState({
    username: "",
    category: "",
    title: "",
    description: "",
    location: "",
    photos: [] as File[],
  })
  const [isDragActive, setIsDragActive] = useState(false);

  // --- Fetch Reports from Backend ---
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:4000/report/list", { withCredentials: true })
      const mapped: CommunityReport[] = (res.data.reports || []).map((r: any, idx: number) => ({
        id: r._id,
        title: r.title || r.content?.slice(0, 30) || `Report #${idx + 1}`,
        description: r.description || r.content || "",
        location: r.location || "Unknown",
        photos: r.image ? 1 : 0,
        votes: r.votes || 0,
        status: r.status || "pending",
        priority: r.priority || "medium",
        reporter: r.username || r.user || "Anonymous",
        timestamp: r.createdAt
          ? new Date(r.createdAt).toLocaleString()
          : new Date().toLocaleString(),
      }))
      setRecentReports(mapped)
      if (mapped.length > 0) {
        setSelectedReport(mapped[0])
      }
    } catch (err) {
      console.error(err);
      setRecentReports([])
      setSelectedReport(null)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  // --- Geo-Location Verification State ---
  const [deviceLocation, setDeviceLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle")
  const [verificationMessage, setVerificationMessage] = useState("")

  // --- Helpers for Location ---

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  const convertDMSToDD = (dms: number[], ref: string) => {
    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600
    if (ref === "S" || ref === "W") {
      dd = dd * -1
    }
    return dd
  }

  const verifyLocation = (file: File) => {
    setVerificationStatus("verifying")
    setVerificationMessage("Verifying location match...")

    if (!navigator.geolocation) {
      setVerificationStatus("failed")
      setVerificationMessage("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude
        const currentLng = position.coords.longitude
        setDeviceLocation({ lat: currentLat, lng: currentLng })

        // Extract EXIF
        import("exif-js").then((EXIF) => {
          EXIF.default.getData(file as any, function (this: any) {
            const lat = EXIF.default.getTag(this, "GPSLatitude")
            const latRef = EXIF.default.getTag(this, "GPSLatitudeRef")
            const lng = EXIF.default.getTag(this, "GPSLongitude")
            const lngRef = EXIF.default.getTag(this, "GPSLongitudeRef")

            if (lat && lng && latRef && lngRef) {
              const imageLat = convertDMSToDD(lat, latRef)
              const imageLng = convertDMSToDD(lng, lngRef)

              const distance = getDistanceFromLatLonInKm(currentLat, currentLng, imageLat, imageLng)

              if (distance < 0.2) { // 200 meters tolerance
                setVerificationStatus("success")
                setVerificationMessage("Location verified! You are at the report location.")
                // Auto-fill location string if empty (reverse geocoding would be better but simple coords for now)
                if (!reportForm.location) {
                  setReportForm(prev => ({ ...prev, location: `${imageLat.toFixed(5)}, ${imageLng.toFixed(5)}` }))
                }
              } else {
                setVerificationStatus("failed")
                setVerificationMessage(`Location mismatch! You are ${distance.toFixed(2)}km away from the image location.`)
              }
            } else {
              setVerificationStatus("failed")
              setVerificationMessage("No GPS data found in image. Cannot verify location.")
              // Optional: Allow manual override if strictness is relaxed, but user asked for strictness.
            }
          })
        })
      },
      (error) => {
        setVerificationStatus("failed")
        setVerificationMessage("Unable to retrieve device location. Please enable location services.")
      }
    )
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setReportForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }))
      // Verify location with the first new file
      verifyLocation(files[0])
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  // Updated drag/drop to verify
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    if (files.length > 0) {
      setReportForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
      verifyLocation(files[0]);
    }
  };

  // --- Submit Report to Backend ---
  const handleSubmitReport = async () => {
    if (reportForm.photos.length === 0) {
      alert("Please upload at least one photo.")
      return
    }

    if (verificationStatus !== "success") {
      alert("Location verification failed. Please insure you are at the location and the photo has GPS data.");
      return;
    }

    const formData = new FormData()
    formData.append("image", reportForm.photos[0]) // Only first image supported by backend
    formData.append("username", reportForm.username || "Anonymous") // <-- use username from form
    formData.append("location", reportForm.location)
    formData.append("title", reportForm.title)
    formData.append("description", reportForm.description)
    formData.append("category", reportForm.category) // Add category

    try {
      const res = await axios.post(
        "http://localhost:4000/report/image",
        formData,
        { withCredentials: true }
      )

      // Backend returns { report, classification, ... }
      const report = res.data.report;
      const classification = res.data.classification;

      // Show submitted report data from backend
      setSubmittedReportData({
        id: report._id,
        timestamp: new Date().toLocaleString(),
        category: report.category || reportForm.category,
        title: report.title || reportForm.title,
        description: report.description || reportForm.description,
        location: report.location || reportForm.location,
        photos: [report.image || "uploaded-photo.jpg"],
        aiDetection: {
          wasteTypes: [classification?.wasteType || "unknown"],
          confidence: 85, // Mocked as backend currently doesn't return confidence score
          recyclable: ["plastic", "glass", "metal", "paper"].includes(classification?.wasteType?.toLowerCase()),
          hazardous: false,
        }
      })
      setShowSubmittedReport(true)

    } catch (err) {
      console.error(err);
      alert("Failed to submit report")
    }
  }

  const handleNewReport = () => {
    setShowSubmittedReport(false)
    setSubmittedReportData(null)
    setReportForm({
      username: "", // <-- reset username
      category: "",
      title: "",
      description: "",
      location: "",
      photos: [],
    })
    setVerificationStatus("idle");
    setVerificationMessage("");
  }


  // --- Submitted Report View ---
  const SubmittedReportView = () => {
    if (!submittedReportData) return null

    return (
      <div className="space-y-6">
        {/* Success Header */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Report Submitted Successfully!</h2>
                <p className="text-green-700">
                  Thank you for helping keep our community clean. Your report has been received and will be reviewed by
                  our team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Report ID</label>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{submittedReportData.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {submittedReportData.timestamp}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p className="text-sm capitalize">{submittedReportData.category.replace("-", " ")}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="text-sm">{submittedReportData.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-sm flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  {submittedReportData.location}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm text-muted-foreground">{submittedReportData.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Detection Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                AI Detection Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Detection Confidence</span>
                <Badge className="bg-blue-100 text-blue-800">{submittedReportData.aiDetection.confidence}%</Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Identified Waste Types</label>
                <div className="flex flex-wrap gap-2">
                  {submittedReportData.aiDetection.wasteTypes.map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`text-sm font-medium ${submittedReportData.aiDetection.recyclable ? "text-green-600" : "text-red-600"}`}
                  >
                    {submittedReportData.aiDetection.recyclable ? "Recyclable" : "Non-Recyclable"}
                  </div>
                  <div className="text-xs text-muted-foreground">Material Type</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`text-sm font-medium ${submittedReportData.aiDetection.hazardous ? "text-red-600" : "text-green-600"}`}
                  >
                    {submittedReportData.aiDetection.hazardous ? "Hazardous" : "Safe"}
                  </div>
                  <div className="text-xs text-muted-foreground">Safety Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              Uploaded Evidence ({submittedReportData.photos.length} photos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {submittedReportData.photos.map((photo, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{photo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-orange-500" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Review Process</p>
                  <p className="text-sm text-muted-foreground">
                    Our Green Champions will review your report within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Investigation</p>
                  <p className="text-sm text-muted-foreground">
                    Municipal authorities will investigate and take appropriate action
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Resolution</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive updates on the status and resolution of your report
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleNewReport} className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Submit Another Report
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            Track This Report
          </Button>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>
    )
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              <span className="font-semibold">Community Reporting</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800">24 Active Reports</Badge>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                My Reports
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {showSubmittedReport && (
            <Button variant="ghost" onClick={handleNewReport} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          )}
          <h1 className="text-3xl font-bold mb-2">Community Waste Reporting</h1>
          <p className="text-muted-foreground">
            "If you see waste, send photo" - Help keep your community clean by reporting waste management issues
          </p>
        </div>

        {showSubmittedReport ? (
          <SubmittedReportView />
        ) : (
          <Tabs defaultValue="report" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="report">Submit Report</TabsTrigger>
              <TabsTrigger value="community">Community Reports</TabsTrigger>
              <TabsTrigger value="my-reports">My Reports</TabsTrigger>
            </TabsList>

            {/* --- Submit Report Tab --- */}
            <TabsContent value="report" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Report Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Submit New Report
                    </CardTitle>
                    <CardDescription>Help improve waste management in your community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {/* Username input */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Name</label>
                        <Input
                          placeholder="Enter your name"
                          value={reportForm.username}
                          onChange={(e) => setReportForm((prev) => ({ ...prev, username: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Report Category</label>
                        <Select
                          value={reportForm.category}
                          onValueChange={(value) => setReportForm((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{category.label}</span>
                                  <Badge className={getPriorityColor(category.priority)} variant="secondary">
                                    {category.priority}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Brief description of the issue"
                          value={reportForm.title}
                          onChange={(e) => setReportForm((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter location or address"
                            value={reportForm.location}
                            onChange={(e) => setReportForm((prev) => ({ ...prev, location: e.target.value }))}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => {
                              if (!navigator.geolocation) {
                                alert("Geolocation is not supported by your browser.")
                                return
                              }
                              setReportForm((prev) => ({ ...prev, location: "Fetching location..." }))
                              navigator.geolocation.getCurrentPosition(
                                async (position) => {
                                  const lat = position.coords.latitude
                                  const lng = position.coords.longitude
                                  try {
                                    const res = await fetch(
                                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                                    )
                                    const data = await res.json()
                                    const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
                                    setReportForm((prev) => ({ ...prev, location: address }))
                                  } catch {
                                    setReportForm((prev) => ({ ...prev, location: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }))
                                  }
                                },
                                (error) => {
                                  alert("Unable to retrieve your location. Please allow location access and try again.")
                                  setReportForm((prev) => ({ ...prev, location: "" }))
                                }
                              )
                            }}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          placeholder="Provide detailed information about the issue"
                          value={reportForm.description}
                          onChange={(e) => setReportForm((prev) => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Photos</label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                            ${isDragActive ? "border-blue-400 bg-blue-50" : "border-muted-foreground/25"}
                          `}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-2">Upload photos of the issue</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Drag & drop images here or click below to select. Photos will be automatically geo-tagged with location data.
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="photo-upload"
                            title="Upload photos of the issue"
                            placeholder="Select photos to upload"
                          />
                          <Button variant="outline" onClick={() => document.getElementById("photo-upload")?.click()}>
                            <Camera className="h-4 w-4 mr-2" />
                            Take/Upload Photos
                          </Button>
                          {isDragActive && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-blue-600 font-semibold text-lg">Drop images here...</span>
                            </div>
                          )}
                        </div>
                        {reportForm.photos.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">{reportForm.photos.length} photos selected</p>
                            <div className="flex gap-2 flex-wrap">
                              {reportForm.photos.map((photo, index) => (
                                <Badge key={index} variant="secondary">
                                  {photo.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verification Status UI */}
                        {verificationStatus !== "idle" && (
                          <div className={`mt-4 p-3 rounded-md flex items-center gap-2 text-sm ${verificationStatus === "success" ? "bg-green-100 text-green-800" :
                            verificationStatus === "failed" ? "bg-red-100 text-red-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                            {verificationStatus === "verifying" && <span className="animate-spin">⌛</span>}
                            {verificationStatus === "success" && <CheckCircle className="h-4 w-4" />}
                            {verificationStatus === "failed" && <AlertTriangle className="h-4 w-4" />}
                            <span>{verificationMessage}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        All reports are reviewed by Green Champions and municipal authorities. False reports may result
                        in account restrictions.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleSubmitReport}
                      className="w-full"
                      disabled={!reportForm.category || !reportForm.title}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Guidelines */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reporting Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Take clear photos</p>
                            <p className="text-sm text-muted-foreground">
                              Ensure photos clearly show the waste management issue
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Include location details</p>
                            <p className="text-sm text-muted-foreground">
                              Provide specific address or landmark information
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Be descriptive</p>
                            <p className="text-sm text-muted-foreground">
                              Explain the issue clearly and suggest solutions if possible
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Report positive examples</p>
                            <p className="text-sm text-muted-foreground">
                              Share good waste management practices to inspire others
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                </div>
              </div>
            </TabsContent>

            {/* --- Community Reports Tab --- */}
            <TabsContent value="community" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input placeholder="Search reports..." />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Reports List */}
                <div className="lg:col-span-1 space-y-4">
                  <h2 className="text-xl font-semibold">Recent Reports</h2>
                  {recentReports.map((report) => (
                    <Card
                      key={report.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${selectedReport && selectedReport.id === report.id ? "ring-2 ring-primary" : ""
                        }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm">{report.title}</CardTitle>
                            <CardDescription className="mt-1">{report.location}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Camera className="h-3 w-3 text-muted-foreground" />
                            <span>{report.photos} photos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{report.votes}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{report.timestamp}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Report Details */}
                <div className="lg:col-span-2">
                  {selectedReport ? (
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{selectedReport.title}</CardTitle>
                            <CardDescription className="mt-2">
                              Reported by {selectedReport.reporter} • {selectedReport.timestamp}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(selectedReport.priority)}>{selectedReport.priority}</Badge>
                            <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Report Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                            <div className="text-sm font-medium">Location</div>
                            <div className="text-xs text-muted-foreground">{selectedReport.location}</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Camera className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                            <div className="text-sm font-medium">{selectedReport.photos} Photos</div>
                            <div className="text-xs text-muted-foreground">Geo-tagged</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                            <div className="text-sm font-medium">{selectedReport.votes} Votes</div>
                            <div className="text-xs text-muted-foreground">Community Support</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Clock className="h-6 w-6 text-green-500 mx-auto mb-2" />
                            <div className="text-sm font-medium">Status</div>
                            <div className="text-xs text-muted-foreground">{selectedReport.status}</div>
                          </div>
                        </div>

                        {/* Photos Placeholder */}
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Report Photos</p>
                            <p className="text-sm text-muted-foreground">{selectedReport.photos} geo-tagged images</p>
                            <Button className="mt-4 bg-transparent" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Photos
                            </Button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                          <Button className="flex-1">
                            <Star className="h-4 w-4 mr-2" />
                            Support Report
                          </Button>
                          <Button variant="outline" className="flex-1 bg-transparent">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                          </Button>
                          <Button variant="outline">
                            <MapPin className="h-4 w-4 mr-2" />
                            View Location
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-muted-foreground text-center py-12">Select a report to view details.</div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* --- My Reports Tab --- */}
            <TabsContent value="my-reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Submitted Reports</CardTitle>
                  <CardDescription>Track the status of your waste management reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.location} • {report.timestamp}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
