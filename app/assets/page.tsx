"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Home,
  Coins,
  Briefcase,
  Shield,
  FileText,
  Car,
  Users,
  Crown,
  Plane,
  BarChart3,
  Activity,
  MoreHorizontal
} from "lucide-react"

interface Asset {
  id: string
  name: string
  type: string
  category: string
  value: number
  previousValue?: number
  status: 'active' | 'pending' | 'expired' | 'review'
  lastUpdated: string
  documents: number
  alerts: number
  icon: any
  color: string
  description: string
  location?: string
  tags: string[]
}

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "value" | "date">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const categories = [
    { id: "all", name: "All Assets", icon: Grid, color: "bg-slate-600" },
    { id: "real-estate", name: "Real Estate", icon: Home, color: "bg-slate-600" },
    { id: "investments", name: "Investments", icon: TrendingUp, color: "bg-slate-600" },
    { id: "crypto", name: "Cryptocurrency", icon: Coins, color: "bg-slate-600" },
    { id: "business", name: "Business & LLCs", icon: Briefcase, color: "bg-slate-600" },
    { id: "insurance", name: "Insurance", icon: Shield, color: "bg-slate-600" },
    { id: "tax", name: "Tax Documents", icon: FileText, color: "bg-slate-600" },
    { id: "vehicles", name: "Vehicles", icon: Car, color: "bg-slate-600" },
    { id: "family", name: "Family Documents", icon: Users, color: "bg-slate-600" },
    { id: "trusts", name: "Trusts & Estates", icon: Crown, color: "bg-slate-600" }
  ]

  const assets: Asset[] = [
    {
      id: "1",
      name: "Primary Residence",
      type: "Primary Home",
      category: "real-estate",
      value: 2500000,
      previousValue: 2400000,
      status: "active",
      lastUpdated: "2024-01-15",
      documents: 12,
      alerts: 2,
      icon: Home,
      color: "bg-blue-600",
      description: "Family home in Beverly Hills",
      location: "Beverly Hills, CA",
      tags: ["primary-home", "family", "mortgage"]
    },
    {
      id: "2",
      name: "Investment Portfolio",
      type: "Stocks & Bonds",
      category: "investments",
      value: 8500000,
      previousValue: 8200000,
      status: "active",
      lastUpdated: "2024-01-20",
      documents: 8,
      alerts: 1,
      icon: TrendingUp,
      color: "bg-green-600",
      description: "Diversified investment portfolio",
      tags: ["stocks", "bonds", "diversified", "retirement"]
    },
    {
      id: "3",
      name: "Bitcoin Holdings",
      type: "Cryptocurrency",
      category: "crypto",
      value: 1200000,
      previousValue: 1100000,
      status: "active",
      lastUpdated: "2024-01-18",
      documents: 5,
      alerts: 0,
      icon: Coins,
      color: "bg-orange-600",
      description: "Cold storage wallet",
      tags: ["bitcoin", "crypto", "cold-storage", "digital"]
    },
    {
      id: "4",
      name: "Tech Startup LLC",
      type: "Business Entity",
      category: "business",
      value: 5000000,
      previousValue: 4800000,
      status: "active",
      lastUpdated: "2024-01-10",
      documents: 15,
      alerts: 3,
      icon: Briefcase,
      color: "bg-purple-600",
      description: "Software company with 25 employees",
      tags: ["llc", "startup", "software", "business"]
    },
    {
      id: "5",
      name: "Umbrella Insurance",
      type: "Liability Coverage",
      category: "insurance",
      value: 10000000,
      status: "active",
      lastUpdated: "2024-01-05",
      documents: 6,
      alerts: 1,
      icon: Shield,
      color: "bg-red-600",
      description: "Personal liability protection",
      tags: ["insurance", "liability", "protection", "umbrella"]
    },
    {
      id: "6",
      name: "Luxury Vehicle Collection",
      type: "Automobiles",
      category: "vehicles",
      value: 1800000,
      previousValue: 1750000,
      status: "active",
      lastUpdated: "2024-01-12",
      documents: 8,
      alerts: 0,
      icon: Car,
      color: "bg-teal-600",
      description: "Collection of luxury and classic vehicles",
      tags: ["luxury", "classic", "collection", "automobiles"]
    },
    {
      id: "7",
      name: "Family Trust Fund",
      type: "Trust",
      category: "trusts",
      value: 15000000,
      previousValue: 14800000,
      status: "active",
      lastUpdated: "2024-01-08",
      documents: 20,
      alerts: 2,
      icon: Crown,
      color: "bg-amber-600",
      description: "Multi-generational family trust",
      tags: ["trust", "family", "generational", "estate-planning"]
    },
    {
      id: "8",
      name: "Private Jet",
      type: "Aircraft",
      category: "vehicles",
      value: 8500000,
      previousValue: 8400000,
      status: "active",
      lastUpdated: "2024-01-14",
      documents: 10,
      alerts: 1,
      icon: Plane,
      color: "bg-indigo-600",
      description: "Gulfstream G650 private jet",
      tags: ["aircraft", "private-jet", "luxury", "transportation"]
    }
  ]

  const filteredAssets = assets.filter(asset => 
    (selectedCategory === "all" || asset.category === selectedCategory) &&
    (searchQuery === "" || asset.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "value":
        comparison = a.value - b.value
        break
      case "date":
        comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'pending': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'expired': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'review': return 'bg-slate-100 text-slate-800 border-slate-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />
      case 'pending': return <Clock size={16} />
      case 'expired': return <AlertTriangle size={16} />
      case 'review': return <Eye size={16} />
      default: return <AlertTriangle size={16} />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalChange = assets.reduce((sum, asset) => sum + ((asset.previousValue || asset.value) - asset.value), 0)
  const percentageChange = totalChange / (totalAssetsValue - totalChange) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Asset Portfolio
          </h1>
          <p className="text-slate-600 mb-6">
            Comprehensive overview of all your assets and investments
          </p>
          
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Portfolio Value</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalAssetsValue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Assets</p>
                    <p className="text-2xl font-bold text-slate-900">{assets.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Portfolio Change</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(Math.abs(totalChange))}
                      </p>
                      <div className={`flex items-center space-x-1 ${totalChange >= 0 ? 'text-slate-900' : 'text-slate-600'}`}>
                        {totalChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="text-sm font-medium">
                          {percentageChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search assets by name, type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-slate-200 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600">
            Showing {sortedAssets.length} of {assets.length} assets
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "value" | "date")}
              className="text-sm border border-slate-200 rounded-md px-2 py-1"
            >
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="date">Date</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAssets.map((asset) => (
            <Card key={asset.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${asset.color} rounded-xl flex items-center justify-center`}>
                      <asset.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {asset.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {asset.type}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(asset.status)}>
                      {getStatusIcon(asset.status)}
                      <span className="ml-1 capitalize">{asset.status}</span>
                    </Badge>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm mb-4">
                  {asset.description}
                </p>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(asset.value)}
                  </p>
                  {asset.previousValue && (
                    <div className={`flex items-center space-x-1 text-sm ${
                      asset.value >= asset.previousValue ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.value >= asset.previousValue ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>
                        {formatCurrency(Math.abs(asset.value - asset.previousValue))} 
                        ({((asset.value - asset.previousValue) / asset.previousValue * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
                
                {asset.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                    <span>{asset.location}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>Updated {new Date(asset.lastUpdated).toLocaleDateString()}</span>
                  <span>{asset.documents} documents</span>
                </div>
                
                {asset.alerts > 0 && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{asset.alerts} alert{asset.alerts > 1 ? 's' : ''} require attention</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {asset.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded text-xs">
                      +{asset.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedAssets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No assets found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? `No assets match "${searchQuery}"` : "Get started by adding your first asset"}
            </p>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Asset
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
