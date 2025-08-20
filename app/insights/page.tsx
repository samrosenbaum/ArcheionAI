"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { InsightsService, Insight, InsightSummary } from "@/lib/insights-service"
import { useMockAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
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
  Loader2,
  RefreshCw,
  X,
  CheckCircle2
} from "lucide-react"

export default function InsightsPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [insights, setInsights] = useState<Insight[]>([])
  const [summary, setSummary] = useState<InsightSummary>({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    totalSavings: 0,
    upcomingDeadlines: 0,
    expiringDocuments: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useMockAuth()
  const { toast } = useToast()

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

  // Load insights on component mount
  useEffect(() => {
    if (user) {
      loadInsights()
    }
  }, [user])

  const loadInsights = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const [insightsData, summaryData] = await Promise.all([
        InsightsService.getUserInsights(user.id),
        InsightsService.getInsightsSummary(user.id)
      ])
      
      setInsights(insightsData)
      setSummary(summaryData)
    } catch (error) {
      console.error('Failed to load insights:', error)
      toast({
        title: "Error",
        description: "Failed to load insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewInsights = async () => {
    if (!user) return
    
    try {
      setIsGenerating(true)
      await InsightsService.generateInsightsFromDocuments(user.id)
      
      // Reload insights after generation
      await loadInsights()
      
      toast({
        title: "Success",
        description: "New insights generated from your documents!",
      })
    } catch (error) {
      console.error('Failed to generate insights:', error)
      toast({
        title: "Error",
        description: "Failed to generate new insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resolveInsight = async (insightId: string) => {
    if (!user) return
    
    try {
      await InsightsService.resolveInsight(insightId, user.id)
      
      // Update local state
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, status: 'resolved' as const }
          : insight
      ))
      
      // Reload summary
      const summaryData = await InsightsService.getInsightsSummary(user.id)
      setSummary(summaryData)
      
      toast({
        title: "Insight Resolved",
        description: "The insight has been marked as resolved.",
      })
    } catch (error) {
      console.error('Failed to resolve insight:', error)
      toast({
        title: "Error",
        description: "Failed to resolve insight. Please try again.",
        variant: "destructive",
      })
    }
  }

  const dismissInsight = async (insightId: string) => {
    if (!user) return
    
    try {
      await InsightsService.dismissInsight(insightId, user.id)
      
      // Update local state
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, status: 'dismissed' as const }
          : insight
      ))
      
      // Reload summary
      const summaryData = await InsightsService.getInsightsSummary(user.id)
      setSummary(summaryData)
      
      toast({
        title: "Insight Dismissed",
        description: "The insight has been dismissed.",
      })
    } catch (error) {
      console.error('Failed to dismiss insight:', error)
      toast({
        title: "Error",
        description: "Failed to dismiss insight. Please try again.",
        variant: "destructive",
      })
    }
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
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expiring': return <Clock className="h-5 w-5 text-slate-700" />
      case 'deadline': return <Calendar className="h-5 w-5 text-slate-700" />
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-slate-700" />
      case 'renewal': return <CheckCircle className="h-5 w-5 text-slate-700" />
      case 'review': return <Eye className="h-5 w-5 text-slate-700" />
      case 'payment': return <DollarSign className="h-5 w-5 text-slate-700" />
      case 'change': return <TrendingUp className="h-5 w-5 text-slate-700" />
      default: return <AlertTriangle className="h-5 w-5 text-slate-700" />
    }
  }

  const getImpactColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-900'
      case 'medium': return 'text-yellow-700'
      case 'low': return 'text-green-700'
      default: return 'text-slate-600'
    }
  }

  const getDaysUntil = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = date.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch {
      return 999
    }
  }

  const getUrgencyText = (daysUntil: number) => {
    if (daysUntil <= 7) return 'Critical'
    if (daysUntil <= 30) return 'Urgent'
    if (daysUntil <= 60) return 'Soon'
    return 'Upcoming'
  }

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 7) return 'text-red-600'
    if (daysUntil <= 30) return 'text-orange-600'
    if (daysUntil <= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  // Filter insights based on selected criteria
  const filteredInsights = insights.filter(insight => {
    const matchesPriority = selectedPriority === "all" || insight.priority === selectedPriority
    const matchesCategory = selectedCategory === "all" || insight.category.toLowerCase() === selectedCategory
    const matchesSearch = searchQuery === "" || 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.assetName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesPriority && matchesCategory && matchesSearch && insight.status === 'active'
  })

  // Active insights only
  const activeInsights = filteredInsights.filter(insight => insight.status === 'active')

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Insights & Alerts</h1>
              <p className="text-slate-600">Smart insights to optimize your assets and avoid missed opportunities</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={generateNewInsights}
                disabled={isGenerating}
                variant="outline"
                className="border-slate-300"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Insights'}
              </Button>
              <Button
                onClick={loadInsights}
                disabled={isLoading}
                variant="outline"
                className="border-slate-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              <span className="text-slate-600">Loading your insights...</span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
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
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
                </div>
                <p className="text-2xl font-bold text-red-900">{summary.high}</p>
                <p className="text-sm text-red-600">High Priority</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-yellow-700" />
                </div>
                <p className="text-2xl font-bold text-yellow-900">{summary.medium}</p>
                <p className="text-sm text-yellow-600">Medium Priority</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
                <p className="text-2xl font-bold text-green-900">{summary.low}</p>
                <p className="text-sm text-green-600">Low Priority</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-blue-700" />
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(summary.totalSavings)}</p>
                <p className="text-sm text-blue-600">Potential Savings</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-orange-700" />
                </div>
                <p className="text-2xl font-bold text-orange-900">{summary.upcomingDeadlines}</p>
                <p className="text-sm text-orange-600">Upcoming Deadlines</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-purple-700" />
                </div>
                <p className="text-2xl font-bold text-purple-900">{summary.expiringDocuments}</p>
                <p className="text-sm text-purple-600">Expiring Soon</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

              <Button 
                variant="outline" 
                className="border-slate-300"
                onClick={() => {
                  setSelectedPriority("all")
                  setSelectedCategory("all")
                  setSearchQuery("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Insights List */}
        <div className="space-y-6">
          {activeInsights.map((insight) => {
            const daysUntil = insight.dueDate ? getDaysUntil(insight.dueDate) : null
            const urgencyText = daysUntil ? getUrgencyText(daysUntil) : null
            const urgencyColor = daysUntil ? getUrgencyColor(daysUntil) : null
            
            return (
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
                          {insight.dueDate && (
                            <div className="mt-2">
                              <p className="text-sm text-slate-500">Due: {formatDate(insight.dueDate)}</p>
                              {urgencyText && (
                                <p className={`text-xs font-medium ${urgencyColor}`}>
                                  {urgencyText} ({daysUntil} days)
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500">Category</p>
                          <p className="font-medium text-slate-900">{insight.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Impact</p>
                          <p className={`font-medium ${getImpactColor(insight.priority)}`}>
                            {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Potential Savings</p>
                          <p className="font-medium text-slate-900">
                            {insight.amount ? formatCurrency(insight.amount) : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {insight.assetName && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Asset:</span> {insight.assetName}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="bg-slate-50 px-4 py-2 rounded-lg">
                          <p className="text-sm font-medium text-slate-900">Recommended Action:</p>
                          <p className="text-slate-600">{insight.action || 'Review this document'}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300"
                            onClick={() => resolveInsight(insight.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-300"
                            onClick={() => dismissInsight(insight.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {!isLoading && activeInsights.length === 0 && (
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">All Caught Up!</h3>
              <p className="text-slate-600 mb-4">
                {insights.length === 0 
                  ? "No insights found. Upload some documents to generate insights automatically."
                  : "No insights match your current filters. Try adjusting your search criteria."
                }
              </p>
              {insights.length === 0 && (
                <Button onClick={generateNewInsights} disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Insights'}
                </Button>
              )}
              {insights.length > 0 && (
                <Button variant="outline" onClick={() => {
                  setSelectedPriority("all")
                  setSelectedCategory("all")
                  setSearchQuery("")
                }}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
