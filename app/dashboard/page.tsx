"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  Plus, Home, Coins, Briefcase, Shield, FileText, TrendingUp, Users, Upload, Eye, ChevronRight, DollarSign, Car, Crown, Grid
} from "lucide-react"

export default function DashboardPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const categories = [
    { id: "real-estate", name: "Real Estate", icon: Home, count: 3, value: 1250000, change: 2.4, documents: 12 },
    { id: "vehicles", name: "Vehicles", icon: Car, count: 2, value: 85000, change: -1.2, documents: 8 },
    { id: "investments", name: "Investments", icon: TrendingUp, count: 8, value: 450000, change: 8.7, documents: 15 },
    { id: "business", name: "Business & LLCs", icon: Briefcase, count: 2, value: 320000, change: 0, documents: 9 },
    { id: "insurance", name: "Insurance", icon: Shield, count: 6, value: 0, change: 0, documents: 18 },
    { id: "crypto", name: "Cryptocurrency", icon: Coins, count: 3, value: 75000, change: -12.5, documents: 6 },
    { id: "family", name: "Family Documents", icon: Users, count: 0, value: 0, change: 0, documents: 24 },
    { id: "trusts", name: "Trusts & Estates", icon: Crown, count: 1, value: 0, change: 0, documents: 7 }
  ]

  const recentDocuments = [
    {
      id: 1,
      name: "Q4 Investment Statement",
      category: "Investments",
      type: "PDF",
      size: "2.4 MB",
      uploaded: "2 hours ago",
      status: "analyzed"
    },
    {
      id: 2,
      name: "Home Insurance Renewal",
      category: "Insurance",
      type: "PDF",
      size: "1.8 MB",
      uploaded: "1 day ago",
      status: "pending"
    },
    {
      id: 3,
      name: "Business Tax Return",
      category: "Business & LLCs",
      type: "PDF",
      size: "3.2 MB",
      uploaded: "3 days ago",
      status: "analyzed"
    },
    {
      id: 4,
      name: "Vehicle Registration",
      category: "Vehicles",
      type: "JPG",
      size: "856 KB",
      uploaded: "1 week ago",
      status: "analyzed"
    }
  ]

  const insights = [
    {
      id: 1,
      title: "Insurance Policy Expiring",
      description: "Your auto insurance expires in 30 days",
      category: "Insurance",
      priority: "high",
      action: "Review and renew policy"
    },
    {
      id: 2,
      title: "Tax Filing Deadline",
      description: "Business tax return due in 45 days",
      category: "Business & LLCs",
      priority: "high",
      action: "Prepare documentation"
    },
    {
      id: 3,
      title: "Investment Rebalancing",
      description: "Portfolio allocation has shifted significantly",
      category: "Investments",
      priority: "medium",
      action: "Review allocation"
    }
  ]

  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0)
  const totalDocuments = categories.reduce((sum, cat) => sum + cat.documents, 0)

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "N/A"
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-slate-50 text-slate-700 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-slate-600'
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600">Here's an overview of your digital vault</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Asset Value</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Documents</p>
                  <p className="text-2xl font-bold text-slate-900">{totalDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Asset Categories</p>
                  <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Grid className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Categories Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Asset Categories</h2>
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <IconComponent className="h-5 w-5 text-slate-600" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                    
                    <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Assets</span>
                        <span className="font-medium text-slate-900">{category.count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Value</span>
                        <span className="font-medium text-slate-900">{formatCurrency(category.value)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Documents</span>
                        <span className="font-medium text-slate-900">{category.documents}</span>
                      </div>
                      {category.change !== 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Change</span>
                          <span className={`font-medium ${getChangeColor(category.change)}`}>
                            {category.change > 0 ? '+' : ''}{category.change}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Recent Documents</CardTitle>
                  <CardDescription className="text-slate-600">Latest additions to your vault</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.category} • {doc.type} • {doc.size}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {doc.status}
                      </Badge>
                      <span className="text-xs text-slate-500">{doc.uploaded}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights & Alerts */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Insights & Alerts</CardTitle>
                  <CardDescription className="text-slate-600">Important items requiring attention</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 mb-1">{insight.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(insight.priority)}`}>
                            {insight.priority} priority
                          </Badge>
                          <span className="text-xs text-slate-500">{insight.category}</span>
                        </div>
                        <p className="text-sm text-slate-700 mt-2 font-medium">{insight.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              <Upload className="h-6 w-6 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Upload Document</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              <Plus className="h-6 w-6 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Add Asset</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              <Eye className="h-6 w-6 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
              <Shield className="h-6 w-6 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Security</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
