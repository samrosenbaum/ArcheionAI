"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  Plus, Search, Grid, List, Eye, Edit, TrendingUp, TrendingDown, CheckCircle, Clock, BarChart3, FileText, MoreHorizontal, PieChart
} from "lucide-react"

export default function InvestmentsPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Investments', count: 8 },
    { id: 'stocks', name: 'Individual Stocks', count: 3 },
    { id: 'bonds', name: 'Bonds', count: 2 },
    { id: 'mutual-funds', name: 'Mutual Funds', count: 2 },
    { id: 'etfs', name: 'ETFs', count: 1 },
    { id: 'retirement', name: 'Retirement Accounts', count: 2 },
    { id: 'alternative', name: 'Alternative', count: 1 }
  ]

  const investments = [
    {
      id: 1,
      name: "Apple Inc. (AAPL)",
      type: "Individual Stock",
      category: "stocks",
      value: 45000,
      costBasis: 38000,
      shares: 150,
      currentPrice: 300,
      changePercent: 18.42,
      changeAmount: 7000,
      lastUpdated: "2024-01-15",
      documents: 2,
      status: "active"
    },
    {
      id: 2,
      name: "Vanguard 500 Index Fund",
      type: "Mutual Fund",
      category: "mutual-funds",
      value: 125000,
      costBasis: 110000,
      shares: 2500,
      currentPrice: 50,
      changePercent: 13.64,
      changeAmount: 15000,
      lastUpdated: "2024-01-15",
      documents: 3,
      status: "active"
    },
    {
      id: 3,
      name: "401(k) - Fidelity",
      type: "Retirement Account",
      category: "retirement",
      value: 320000,
      costBasis: 280000,
      shares: 0,
      currentPrice: 0,
      changePercent: 14.29,
      changeAmount: 40000,
      lastUpdated: "2024-01-15",
      documents: 5,
      status: "active"
    },
    {
      id: 4,
      name: "Tesla Inc. (TSLA)",
      type: "Individual Stock",
      category: "stocks",
      value: 28000,
      costBasis: 35000,
      shares: 200,
      currentPrice: 140,
      changePercent: -20.00,
      changeAmount: -7000,
      lastUpdated: "2024-01-15",
      documents: 2,
      status: "active"
    },
    {
      id: 5,
      name: "US Treasury Bond",
      type: "Government Bond",
      category: "bonds",
      value: 15000,
      costBasis: 15000,
      shares: 0,
      currentPrice: 0,
      changePercent: 0.00,
      changeAmount: 0,
      lastUpdated: "2024-01-15",
      documents: 1,
      status: "active"
    },
    {
      id: 6,
      name: "SPDR S&P 500 ETF",
      type: "ETF",
      category: "etfs",
      value: 45000,
      costBasis: 42000,
      shares: 100,
      currentPrice: 450,
      changePercent: 7.14,
      changeAmount: 3000,
      lastUpdated: "2024-01-15",
      documents: 2,
      status: "active"
    },
    {
      id: 7,
      name: "IRA - Vanguard",
      type: "Retirement Account",
      category: "retirement",
      value: 180000,
      costBasis: 160000,
      shares: 0,
      currentPrice: 0,
      changePercent: 12.50,
      changeAmount: 20000,
      lastUpdated: "2024-01-15",
      documents: 4,
      status: "active"
    },
    {
      id: 8,
      name: "Private Equity Fund",
      type: "Alternative Investment",
      category: "alternative",
      value: 75000,
      costBasis: 75000,
      shares: 0,
      currentPrice: 0,
      changePercent: 0.00,
      changeAmount: 0,
      lastUpdated: "2024-01-15",
      documents: 3,
      status: "active"
    }
  ]

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investment.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || investment.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0)
  const totalGainLoss = investments.reduce((sum, inv) => sum + inv.changeAmount, 0)
  const totalGainLossPercent = totalGainLoss / (totalValue - totalGainLoss) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />
      case 'pending': return <Clock size={16} />
      case 'sold': return <CheckCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-slate-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} />
    if (change < 0) return <TrendingDown size={16} />
    return null
  }

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Investments</h1>
              <p className="text-slate-600">Track your investment portfolio and performance</p>
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Gain/Loss</p>
                    <p className={`text-2xl font-bold ${getChangeColor(totalGainLoss)}`}>
                      {formatCurrency(totalGainLoss)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Return %</p>
                    <p className={`text-2xl font-bold ${getChangeColor(totalGainLossPercent)}`}>
                      {totalGainLossPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Documents</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {investments.reduce((sum, inv) => sum + inv.documents, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search investments, tickers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Investments Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map((investment) => (
              <Card key={investment.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{investment.name}</CardTitle>
                      <CardDescription className="text-slate-600">{investment.type}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(investment.status)}>
                      {getStatusIcon(investment.status)}
                      <span className="ml-1 capitalize">{investment.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Current Value</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(investment.value)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Gain/Loss</p>
                      <div className="flex items-center space-x-1">
                        {getChangeIcon(investment.changeAmount)}
                        <p className={`font-semibold ${getChangeColor(investment.changeAmount)}`}>
                          {formatCurrency(investment.changeAmount)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500">Return %</p>
                      <p className={`font-semibold ${getChangeColor(investment.changePercent)}`}>
                        {investment.changePercent.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Shares</p>
                      <p className="font-semibold text-slate-900">
                        {investment.shares > 0 ? investment.shares : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <FileText className="h-4 w-4" />
                      <span>{investment.documents} documents</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <Card key={investment.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{investment.name}</h3>
                        <p className="text-sm text-slate-600">{investment.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Current Value</p>
                        <p className="font-semibold text-slate-900">{formatCurrency(investment.value)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Gain/Loss</p>
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(investment.changeAmount)}
                          <p className={`font-semibold ${getChangeColor(investment.changeAmount)}`}>
                            {formatCurrency(investment.changeAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Return %</p>
                        <p className={`font-semibold ${getChangeColor(investment.changePercent)}`}>
                          {investment.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <Badge className={getStatusColor(investment.status)}>
                        {getStatusIcon(investment.status)}
                        <span className="ml-1 capitalize">{investment.status}</span>
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredInvestments.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No investments found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or add your first investment.</p>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
