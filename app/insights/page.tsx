"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  Search,
  Eye,

} from "lucide-react"

export default function InsightsPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const priorities = [
    { id: "all", name: "All Priorities" },
    { id: "high", name: "High Priority" },
    { id: "medium", name: "Medium Priority" },
    { id: "low", name: "Low Priority" }
  ]

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "insurance", name: "Insurance" },
    { id: "tax", name: "Tax" },
    { id: "investments", name: "Investments" },
    { id: "real-estate", name: "Real Estate" },
    { id: "business", name: "Business" },
    { id: "career", name: "Career" },
    { id: "vehicles", name: "Vehicles" }
  ]

  const insights = [
    {
      id: 1,
      title: "Insurance Policy Expiring",
      description: "Your auto insurance policy expires in 30 days. Consider reviewing coverage and shopping for competitive rates.",
      category: "Insurance",
      priority: "high",
      type: "expiring",
      dueDate: "2024-02-15",
      impact: "High",
      action: "Review and renew policy",
      estimatedSavings: 150
    },
    {
      id: 2,
      title: "Tax Filing Deadline",
      description: "Business tax return due in 45 days. Ensure all documentation is prepared and consider tax optimization strategies.",
      category: "Tax",
      priority: "high",
      type: "deadline",
      dueDate: "2024-03-01",
      impact: "High",
      action: "Prepare documentation and file return",
      estimatedSavings: 0
    },
    {
      id: 3,
      title: "Investment Rebalancing Opportunity",
      description: "Portfolio allocation has shifted significantly. Consider rebalancing to maintain target allocation and risk profile.",
      category: "Investments",
      priority: "medium",
      type: "opportunity",
      dueDate: "2024-02-28",
      impact: "Medium",
      action: "Review allocation and rebalance",
      estimatedSavings: 25000
    },
    {
      id: 4,
      title: "License Renewal Due",
      description: "Professional license renewal due in 60 days. Check continuing education requirements.",
      category: "Career",
      priority: "medium",
      type: "renewal",
      dueDate: "2024-03-15",
      impact: "Medium",
      action: "Complete CE requirements and renew",
      estimatedSavings: 0
    },
    {
      id: 5,
      title: "Property Tax Assessment",
      description: "Property tax assessment available for review. Consider appealing if assessment seems high.",
      category: "Real Estate",
      priority: "low",
      type: "review",
      dueDate: "2024-04-01",
      impact: "Low",
      action: "Review assessment and consider appeal",
      estimatedSavings: 500
    },
    {
      id: 6,
      title: "Vehicle Registration Renewal",
      description: "Vehicle registration renewal due in 90 days. Check for any outstanding violations.",
      category: "Vehicles",
      priority: "low",
      type: "renewal",
      dueDate: "2024-05-01",
      impact: "Low",
      action: "Renew registration",
      estimatedSavings: 0
    }
  ]

  const summary = {
    total: insights.length,
    high: insights.filter(i => i.priority === 'high').length,
    medium: insights.filter(i => i.priority === 'medium').length,
    low: insights.filter(i => i.priority === 'low').length,
    totalSavings: insights.reduce((sum, i) => sum + i.estimatedSavings, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'medium': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'low': return 'bg-slate-50 text-slate-600 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expiring': return <Clock className="h-5 w-5 text-slate-700" />
      case 'deadline': return <Calendar className="h-5 w-5 text-slate-700" />
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-slate-700" />
      case 'renewal': return <CheckCircle className="h-5 w-5 text-slate-200" />
      case 'review': return <Eye className="h-5 w-5 text-slate-700" />
      default: return <AlertTriangle className="h-5 w-5 text-slate-700" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-slate-900'
      case 'Medium': return 'text-slate-700'
      case 'Low': return 'text-slate-600'
      default: return 'text-slate-600'
    }
  }

  const filteredInsights = insights.filter(insight => {
    const matchesPriority = selectedPriority === "all" || insight.priority === selectedPriority
    const matchesCategory = selectedCategory === "all" || insight.category.toLowerCase() === selectedCategory
    return matchesPriority && matchesCategory
  })

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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Insights & Alerts</h1>
          <p className="text-slate-600">Smart insights to optimize your assets and avoid missed opportunities</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.total}</p>
              <p className="text-sm text-slate-600">Total Insights</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.high}</p>
              <p className="text-sm text-slate-600">High Priority</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.medium}</p>
              <p className="text-sm text-slate-600">Medium Priority</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.low}</p>
              <p className="text-sm text-slate-600">Low Priority</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalSavings)}</p>
              <p className="text-sm text-slate-600">Potential Savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search insights..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      {priority.name}
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

        {/* Insights List */}
        <div className="space-y-6">
          {filteredInsights.map((insight) => (
            <Card key={insight.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{insight.title}</h3>
                        <p className="text-slate-600 mb-3">{insight.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority} priority
                        </Badge>
                        <p className="text-sm text-slate-500 mt-1">Due: {formatDate(insight.dueDate)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500">Category</p>
                        <p className="font-medium text-slate-900">{insight.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Impact</p>
                        <p className={`font-medium ${getImpactColor(insight.impact)}`}>{insight.impact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Potential Savings</p>
                        <p className="font-medium text-slate-900">{formatCurrency(insight.estimatedSavings)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="bg-slate-50 px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium text-slate-900">Recommended Action:</p>
                        <p className="text-slate-600">{insight.action}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-slate-300">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredInsights.length === 0 && (
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">All Caught Up!</h3>
              <p className="text-slate-600 mb-4">No insights match your current filters. Try adjusting your search criteria.</p>
              <Button variant="outline" onClick={() => {
                setSelectedPriority("all")
                setSelectedCategory("all")
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
