"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  Home,
  FileText,
  Shield,
  TrendingUp,
  Home as HomeIcon,
  Car,
  Building,
  Users,
  Crown,
  Coins,
  BarChart3,
  ChevronRight,
  Upload,
  Plus,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react"

export default function DashboardPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const router = useRouter()

  const categories = [
    { id: "real-estate", name: "Real Estate", icon: Home, count: 3, value: 1250000, change: 2.4, documents: 12 },
    { id: "vehicles", name: "Vehicles", icon: Car, count: 2, value: 85000, change: -1.2, documents: 8 },
    { id: "investments", name: "Investments", icon: TrendingUp, count: 8, value: 450000, change: 8.7, documents: 15 },
    { id: "business", name: "Business & LLCs", icon: Building, count: 2, value: 320000, change: 0, documents: 9 },
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
      case 'high': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'medium': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'low': return 'bg-slate-50 text-slate-600 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-slate-900'
    if (change < 0) return 'text-slate-600'
    return 'text-slate-500'
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/${categoryId}`)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload':
        router.push('/upload')
        break
      case 'add-asset':
        router.push('/add-asset')
        break
      case 'reports':
        router.push('/reports')
        break
      case 'security':
        router.push('/security')
        break
      default:
        break
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600">Here's an overview of your digital vault</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Total Asset Value</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Total Documents</p>
                  <p className="text-3xl font-bold text-slate-900">{totalDocuments}</p>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-7 w-7 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Asset Categories</p>
                  <p className="text-3xl font-bold text-slate-900">{categories.length}</p>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-slate-700" />
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
                <Card key={category.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white cursor-pointer group hover:border-slate-300" onClick={() => handleCategoryClick(category.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-slate-700" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                    
                    <h3 className="font-semibold text-slate-900 mb-3 text-lg">{category.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Assets</span>
                        <span className="font-semibold text-slate-900">{category.count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Value</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(category.value)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Documents</span>
                        <span className="font-semibold text-slate-900">{category.documents}</span>
                      </div>
                      {category.change !== 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Change</span>
                          <span className={`font-semibold ${getChangeColor(category.change)}`}>
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
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900" onClick={() => router.push('/documents')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => router.push(`/documents/${doc.id}`)}>
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
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900" onClick={() => router.push('/insights')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => router.push(`/insights/${insight.id}`)}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        insight.priority === 'high' ? 'bg-slate-900' : 
                        insight.priority === 'medium' ? 'bg-slate-600' : 'bg-slate-400'
                      }`}></div>
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
            <Button variant="outline" className="h-24 flex-col space-y-3 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200" onClick={() => handleQuickAction('upload')}>
              <Upload className="h-7 w-7 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Upload Document</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-3 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200" onClick={() => handleQuickAction('add-asset')}>
              <Plus className="h-7 w-7 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Add Asset</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-3 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200" onClick={() => handleQuickAction('reports')}>
              <Eye className="h-7 w-7 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">View Reports</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-3 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200" onClick={() => handleQuickAction('security')}>
              <Shield className="h-7 w-7 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Security</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
