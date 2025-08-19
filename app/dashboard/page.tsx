"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { useMockAuth } from "@/lib/auth-context"
import { createClient } from '@supabase/supabase-js'
import { 
  Home,
  FileText,
  Shield,
  TrendingUp,
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
  Loader2,
  AlertTriangle
} from "lucide-react"

export default function DashboardPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    categories: [] as any[],
    recentDocuments: [] as any[],
    insights: [] as any[],
    totalDocuments: 0,
    totalValue: 0
  })
  const router = useRouter()
  const { user } = useMockAuth()

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Base category definitions (for icons and structure)
  const baseCategories = [
    { id: "real-estate", name: "Real Estate", icon: Home },
    { id: "vehicles", name: "Vehicles", icon: Car },
    { id: "investments", name: "Investments", icon: TrendingUp },
    { id: "business", name: "Business & LLCs", icon: Building },
    { id: "insurance", name: "Insurance", icon: Shield },
    { id: "crypto", name: "Cryptocurrency", icon: Coins },
    { id: "family", name: "Family Documents", icon: Users },
    { id: "trusts", name: "Trusts & Estates", icon: Crown }
  ]

  // Fetch dashboard data from Supabase
  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all documents with categories and asset info
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('category, subcategory, created_at, name, file_size, asset_name')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (docError) {
        console.error('Error fetching documents:', docError)
        setIsLoading(false)
        return
      }

      // Process categories with real data
      const processedCategories = baseCategories.map(category => {
        const categoryDocs = documents.filter(doc => 
          doc.category.toLowerCase() === category.id || 
          doc.category.toLowerCase().includes(category.id)
        )
        
        // Group documents by asset for better organization
        const assetGroups: { [key: string]: any[] } = {}
        categoryDocs.forEach(doc => {
          const assetName = doc.asset_name || 'Uncategorized'
          if (!assetGroups[assetName]) {
            assetGroups[assetName] = []
          }
          assetGroups[assetName].push(doc)
        })
        
        return {
          ...category,
          count: Object.keys(assetGroups).length, // Number of assets
          documents: categoryDocs.length, // Total documents
          assetGroups,
          value: 0, // We'll add value calculation later
          change: 0  // We'll add change calculation later
        }
      })

      // Get recent documents
      const recentDocs = documents
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(doc => ({
          id: doc.name,
          name: doc.name,
          category: doc.category,
          assetName: doc.asset_name || 'Uncategorized',
          type: doc.file_size ? 'PDF' : 'Unknown',
          size: doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'Unknown',
          uploaded: getTimeAgo(doc.created_at),
          status: 'analyzed'
        }))

      // Get insights from document_insights
      const { data: insights, error: insightError } = await supabase
        .from('document_insights')
        .select('insights, created_at')
        .eq('user_id', user.id)
        .limit(10)

      let processedInsights: any[] = []
      if (!insightError && insights) {
        processedInsights = insights
          .filter(insight => insight.insights && insight.insights.length > 0)
          .flatMap(insight => insight.insights)
          .slice(0, 5)
          .map((insight, index) => ({
            id: index + 1,
            title: insight.title || 'Document Insight',
            description: insight.description || 'Important information found',
            category: 'Documents',
            priority: 'medium',
            action: insight.action || 'Review document'
          }))
      }

      // Update dashboard data
      setDashboardData({
        categories: processedCategories,
        recentDocuments: recentDocs,
        insights: processedInsights,
        totalDocuments: documents.length,
        totalValue: 0 // We'll add value calculation later
      })

      console.log('Dashboard data loaded:', {
        totalDocuments: documents.length,
        categories: processedCategories.length,
        recentDocs: recentDocs.length,
        insights: processedInsights.length
      })
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const totalValue = dashboardData.totalValue
  const totalDocuments = dashboardData.totalDocuments

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              <span className="text-slate-600">Loading your vault...</span>
            </div>
          </div>
        )}

        {/* Empty State - Show when no data and not loading */}
        {!isLoading && dashboardData.totalDocuments === 0 && (
          <div className="text-center py-16 px-4">
            <div className="max-w-2xl mx-auto">
              {/* Welcome Icon */}
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-slate-600" />
              </div>
              
              {/* Welcome Message */}
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Welcome to Your Digital Safe
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                This is your secure vault for everything important in your life. Think of it as a CFO-level oversight system for your personal assets, documents, and important information.
              </p>

              {/* Value Proposition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Secure Document Storage</h3>
                  <p className="text-sm text-slate-600">All your important papers in one encrypted, searchable place</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Smart Organization</h3>
                  <p className="text-sm text-slate-600">AI-powered categorization and insights from your documents</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Proactive Monitoring</h3>
                  <p className="text-sm text-slate-600">Track renewal dates, changes, and important deadlines</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-4">
                <p className="text-slate-700 font-medium">
                  Ready to get started? Let's add your first asset:
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/upload')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Asset
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/onboarding')}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Take a Tour
                  </Button>
                </div>
              </div>

              {/* Quick Start Tips */}
              <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4 text-center">Quick Start Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Start with your most important documents (insurance, property, investments)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use descriptive asset names like "281 Loraine Road - Memphis Property"</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Upload related documents together to keep them organized</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Our AI will automatically categorize and extract key information</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Content - Only show when there's data */}
        {!isLoading && dashboardData.totalDocuments > 0 && (
          <>
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
                  <p className="text-3xl font-bold text-slate-900">{dashboardData.categories.length}</p>
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
            {dashboardData.categories.map((category: any) => {
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
                {dashboardData.recentDocuments.map((doc: any) => (
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
                {dashboardData.insights.map((insight: any) => (
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
          </>
        )}
      </main>
    </div>
  )
}
