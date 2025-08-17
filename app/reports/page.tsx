"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Search,
  Shield,
  Home,
  Car,
  Coins,
  Building,
  Users,
  Crown,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react"

export default function ReportsPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const periods = [
    { id: "7d", name: "Last 7 Days" },
    { id: "30d", name: "Last 30 Days" },
    { id: "90d", name: "Last 90 Days" },
    { id: "1y", name: "Last Year" },
    { id: "all", name: "All Time" }
  ]

  const categories = [
    { id: "all", name: "All Categories", icon: BarChart3 },
    { id: "real-estate", name: "Real Estate", icon: Home },
    { id: "vehicles", name: "Vehicles", icon: Car },
    { id: "investments", name: "Investments", icon: TrendingUp },
    { id: "business", name: "Business & LLCs", icon: Building },
    { id: "insurance", name: "Insurance", icon: Shield },
    { id: "crypto", name: "Cryptocurrency", icon: Coins },
    { id: "family", name: "Family Documents", icon: Users },
    { id: "trusts", name: "Trusts & Estates", icon: Crown }
  ]

  const portfolioData = {
    totalValue: 8750000,
    change: 4.2,
    changeAmount: 350000,
    categories: [
      { name: "Real Estate", value: 5000000, percentage: 57.1, change: 2.4 },
      { name: "Investments", value: 2500000, percentage: 28.6, change: 8.7 },
      { name: "Business", value: 800000, percentage: 9.1, change: 0 },
      { name: "Vehicles", value: 250000, percentage: 2.9, change: -1.2 },
      { name: "Crypto", value: 200000, percentage: 2.3, change: -12.5 }
    ]
  }

  const documentStats = {
    total: 156,
    analyzed: 142,
    pending: 14,
    categories: [
      { name: "Insurance", count: 28, percentage: 18.0 },
      { name: "Tax Documents", count: 24, percentage: 15.4 },
      { name: "Real Estate", count: 22, percentage: 14.1 },
      { name: "Business", count: 20, percentage: 12.8 },
      { name: "Investments", count: 18, percentage: 11.5 },
      { name: "Vehicles", count: 16, percentage: 10.3 },
      { name: "Family", count: 14, percentage: 9.0 },
      { name: "Other", count: 14, percentage: 9.0 }
    ]
  }

  const alerts = [
    {
      id: 1,
      type: "expiring",
      title: "Insurance Policy Expiring",
      description: "Auto insurance expires in 30 days",
      priority: "high",
      category: "Insurance",
      dueDate: "2024-02-15"
    },
    {
      id: 2,
      type: "deadline",
      title: "Tax Filing Deadline",
      description: "Business tax return due in 45 days",
      priority: "high",
      category: "Tax",
      dueDate: "2024-03-01"
    },
    {
      id: 3,
      type: "renewal",
      title: "License Renewal",
      description: "Professional license renewal due",
      priority: "medium",
      category: "Career",
      dueDate: "2024-02-28"
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-slate-900'
    if (change < 0) return 'text-slate-600'
    return 'text-slate-500'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'medium': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'low': return 'bg-slate-50 text-slate-600 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" />
            <Navigation 
              showMobileMenu={showMobileMenu}
              onMobileMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive insights into your asset portfolio and document management</p>
        </div>

        {/* Filters */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-slate-300">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-slate-700" />
                <span>Portfolio Value</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                {formatCurrency(portfolioData.totalValue)}
              </p>
              <div className="flex items-center space-x-2">
                {portfolioData.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-slate-700" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-slate-700" />
                )}
                <span className={`text-sm font-medium ${getChangeColor(portfolioData.change)}`}>
                  {portfolioData.change >= 0 ? '+' : ''}{portfolioData.change}% ({formatCurrency(portfolioData.changeAmount)})
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-slate-700" />
                <span>Total Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                {documentStats.total}
              </p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-slate-700" />
                <span className="text-sm text-slate-600">
                  {documentStats.analyzed} analyzed, {documentStats.pending} pending
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-slate-700" />
                <span>Active Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                {alerts.length}
              </p>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-700" />
                <span className="text-sm text-slate-600">
                  {alerts.filter(a => a.priority === 'high').length} high priority
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Portfolio Breakdown</CardTitle>
              <CardDescription>Asset allocation by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                      <span className="text-sm font-medium text-slate-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(category.value)}</p>
                      <p className="text-xs text-slate-500">{formatPercentage(category.percentage)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Document Distribution</CardTitle>
              <CardDescription>Documents by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentStats.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                      <span className="text-sm font-medium text-slate-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{category.count}</p>
                      <p className="text-xs text-slate-500">{formatPercentage(category.percentage)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.priority === 'high' ? 'bg-slate-900' : 
                      alert.priority === 'medium' ? 'bg-slate-600' : 'bg-slate-400'
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-slate-900">{alert.title}</h4>
                      <p className="text-sm text-slate-600">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority} priority
                    </Badge>
                    <span className="text-sm text-slate-500">{alert.category}</span>
                    <span className="text-sm text-slate-500">Due: {alert.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-4">
            <Button variant="outline" className="border-slate-300">
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button variant="outline" className="border-slate-300">
              <Download className="h-4 w-4 mr-2" />
              Export Excel Data
            </Button>
            <Button variant="outline" className="border-slate-300">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
