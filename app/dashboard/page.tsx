"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Calendar,
  Upload,
  Bell,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  PieChart,
  CreditCard,
  Home,
  Briefcase,
  Camera,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { PhotoCapture } from "@/components/photo-capture"
import { isDemoMode } from "@/lib/document-storage"
import { Logo } from "@/components/logo"

// Mock data for the dashboard
const mockCategories = [
  {
    id: "tax",
    name: "Tax Documents",
    icon: FileText,
    color: "bg-blue-500",
    document_count: 12,
    total_value: 125000,
    last_updated: "2024-01-15",
    description: "Tax returns, W-2s, 1099s",
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    color: "bg-green-500",
    document_count: 8,
    total_value: 2400,
    last_updated: "2024-01-10",
    description: "Auto, home, life insurance policies",
  },
  {
    id: "investments",
    name: "Investments",
    icon: TrendingUp,
    color: "bg-purple-500",
    document_count: 15,
    total_value: 450000,
    last_updated: "2024-01-12",
    description: "Brokerage statements, 401k, IRA",
  },
  {
    id: "banking",
    name: "Banking",
    icon: CreditCard,
    color: "bg-orange-500",
    document_count: 24,
    total_value: 85000,
    last_updated: "2024-01-14",
    description: "Bank statements, loan documents",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: Home,
    color: "bg-red-500",
    document_count: 6,
    total_value: 750000,
    last_updated: "2024-01-08",
    description: "Property deeds, mortgage documents",
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    color: "bg-indigo-500",
    document_count: 18,
    total_value: 320000,
    last_updated: "2024-01-13",
    description: "Business filings, contracts, invoices",
  },
]

const mockInsights = [
  {
    id: "1",
    type: "tax_optimization",
    title: "Tax Deduction Opportunity",
    description: "You may be eligible for additional $3,200 in deductions based on your 2024 documents",
    priority: "high" as const,
    potential_savings: 3200,
    confidence: 92,
    category: "Tax",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "insurance_gap",
    title: "Coverage Gap Identified",
    description: "Your current auto insurance liability limits may be insufficient for your asset level",
    priority: "high" as const,
    confidence: 88,
    category: "Insurance",
    created_at: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    type: "investment_rebalance",
    title: "Portfolio Rebalancing Needed",
    description: "Your asset allocation has drifted 8% from target. Consider rebalancing.",
    priority: "medium" as const,
    confidence: 85,
    category: "Investments",
    created_at: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    type: "rate_optimization",
    title: "Better Savings Rate Available",
    description: "Found savings accounts offering 2.3% higher interest than your current rate",
    priority: "medium" as const,
    potential_savings: 1800,
    confidence: 95,
    category: "Banking",
    created_at: "2024-01-12T14:20:00Z",
  },
]

const mockRecentActivity = [
  {
    id: "1",
    action: "Document uploaded",
    document: "2024_Tax_Return_Draft.pdf",
    category: "Tax",
    timestamp: "2 hours ago",
    status: "analyzed",
  },
  {
    id: "2",
    action: "Insight generated",
    document: "Auto_Insurance_Policy.pdf",
    category: "Insurance",
    timestamp: "5 hours ago",
    status: "completed",
  },
  {
    id: "3",
    action: "Document processed",
    document: "Q4_Investment_Statement.pdf",
    category: "Investments",
    timestamp: "1 day ago",
    status: "analyzed",
  },
  {
    id: "4",
    action: "SMS document received",
    document: "Bank_Statement_Photo.jpg",
    category: "Banking",
    timestamp: "2 days ago",
    status: "processing",
  },
]

export default function Dashboard() {
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [totalInsights, setTotalInsights] = useState(0)
  const [potentialSavings, setPotentialSavings] = useState(0)
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)

  useEffect(() => {
    // Calculate totals from mock data
    const docCount = mockCategories.reduce((sum, cat) => sum + cat.document_count, 0)
    const insightCount = mockInsights.length
    const savings = mockInsights.reduce((sum, insight) => sum + (insight.potential_savings || 0), 0)

    setTotalDocuments(docCount)
    setTotalInsights(insightCount)
    setPotentialSavings(savings)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzed":
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Logo size="lg" showIcon={true} />
                {isDemoMode && (
                  <Badge variant="outline" className="text-xs">
                    Demo Mode
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPhotoCapture(true)}
                className="hidden sm:flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Quick Capture</span>
              </Button>

              <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2 bg-transparent">
                <MessageSquare className="w-4 h-4" />
                <span>SMS Upload</span>
              </Button>

              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Archeion</h1>
          <p className="text-gray-600">Your AI-powered financial document management platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <TrendingUp className="h-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInsights}</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${potentialSavings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Identified opportunities</p>
              <Progress value={98} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">Documents analyzed</p>
              <Progress value={98} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Upload and analyze your financial documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                onClick={() => setShowPhotoCapture(true)}
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">Photo Capture</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">SMS Upload</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm">File Upload</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Schedule Scan</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Categories */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Document Categories</CardTitle>
                  <CardDescription>Organize and manage your financial documents</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Link key={category.id} href={`/category/${category.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}
                                >
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-sm">{category.name}</h3>
                                  <p className="text-xs text-muted-foreground">{category.description}</p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Upload Document</DropdownMenuItem>
                                  <DropdownMenuItem>Export Data</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Documents</p>
                                <p className="font-semibold">{category.document_count}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total Value</p>
                                <p className="font-semibold">
                                  {category.total_value ? `$${category.total_value.toLocaleString()}` : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-muted-foreground">
                                Last updated: {new Date(category.last_updated).toLocaleDateString()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>AI Insights</span>
                </CardTitle>
                <CardDescription>Latest financial optimization opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getPriorityColor(insight.priority)} variant="outline">
                        {insight.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{insight.confidence}% confident</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    {insight.potential_savings && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <DollarSign className="w-3 h-3" />
                        <span className="text-xs font-semibold">
                          ${insight.potential_savings.toLocaleString()} savings
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Insights
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.document}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge className={getStatusColor(activity.status)} variant="outline">
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <PhotoCapture
          onClose={() => setShowPhotoCapture(false)}
          onCapture={(file) => {
            console.log("Captured file:", file)
            setShowPhotoCapture(false)
            // Here you would typically upload the file
          }}
        />
      )}
    </div>
  )
}
