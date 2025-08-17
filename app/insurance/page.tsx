"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  Plus, Search, Grid, List, Eye, Edit, DollarSign, AlertTriangle, CheckCircle, Clock, Shield, FileText, MoreHorizontal
} from "lucide-react"

export default function InsurancePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Policies', count: 12 },
    { id: 'auto', name: 'Auto Insurance', count: 3 },
    { id: 'home', name: 'Home Insurance', count: 2 },
    { id: 'life', name: 'Life Insurance', count: 2 },
    { id: 'umbrella', name: 'Umbrella Policy', count: 1 },
    { id: 'health', name: 'Health Insurance', count: 2 },
    { id: 'business', name: 'Business Insurance', count: 2 }
  ]

  const policies = [
    {
      id: 1,
      name: "Primary Auto Insurance",
      provider: "State Farm",
      type: "Auto Insurance",
      premium: 1200,
      coverage: 500000,
      deductible: 500,
      renewalDate: "2024-06-15",
      status: "active",
      documents: 3,
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      name: "Homeowners Policy",
      provider: "Allstate",
      type: "Home Insurance",
      premium: 2400,
      coverage: 750000,
      deductible: 1000,
      renewalDate: "2024-08-20",
      status: "active",
      documents: 5,
      lastUpdated: "2024-01-10"
    },
    {
      id: 3,
      name: "Term Life Insurance",
      provider: "Northwestern Mutual",
      type: "Life Insurance",
      premium: 1800,
      coverage: 2000000,
      deductible: 0,
      renewalDate: "2025-03-01",
      status: "active",
      documents: 2,
      lastUpdated: "2024-01-05"
    },
    {
      id: 4,
      name: "Personal Umbrella Policy",
      provider: "Travelers",
      type: "Umbrella Policy",
      premium: 450,
      coverage: 1000000,
      deductible: 0,
      renewalDate: "2024-12-01",
      status: "active",
      documents: 1,
      lastUpdated: "2024-01-12"
    },
    {
      id: 5,
      name: "Secondary Vehicle",
      provider: "Geico",
      type: "Auto Insurance",
      premium: 800,
      coverage: 300000,
      deductible: 1000,
      renewalDate: "2024-07-10",
      status: "expiring",
      documents: 2,
      lastUpdated: "2024-01-08"
    },
    {
      id: 6,
      name: "Rental Property Insurance",
      provider: "Liberty Mutual",
      type: "Home Insurance",
      premium: 1800,
      coverage: 400000,
      deductible: 1500,
      renewalDate: "2024-09-15",
      status: "active",
      documents: 4,
      lastUpdated: "2024-01-03"
    }
  ]

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || policy.type.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'expiring': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'expired': return 'bg-slate-100 text-slate-800 border-slate-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />
      case 'expiring': return <AlertTriangle size={16} />
      case 'expired': return <AlertTriangle size={16} />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const daysUntilRenewal = (dateString: string) => {
    const today = new Date()
    const renewal = new Date(dateString)
    const diffTime = renewal.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
              <h1 className="text-3xl font-bold text-slate-900">Insurance</h1>
              <p className="text-slate-600">Manage your insurance policies and coverage</p>
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Policies</p>
                    <p className="text-2xl font-bold text-slate-900">{policies.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Annual Premiums</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(policies.reduce((sum, policy) => sum + policy.premium, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Documents</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {policies.reduce((sum, policy) => sum + policy.documents, 0)}
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Expiring Soon</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {policies.filter(policy => daysUntilRenewal(policy.renewalDate) <= 30).length}
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
                placeholder="Search policies, providers..."
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

        {/* Policies Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <CardDescription className="text-slate-600">{policy.provider}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(policy.status)}>
                      {getStatusIcon(policy.status)}
                      <span className="ml-1 capitalize">{policy.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Annual Premium</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(policy.premium)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Coverage</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(policy.coverage)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Deductible</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(policy.deductible)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Renewal</p>
                      <p className="font-semibold text-slate-900">{formatDate(policy.renewalDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <FileText className="h-4 w-4" />
                      <span>{policy.documents} documents</span>
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
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{policy.name}</h3>
                        <p className="text-sm text-slate-600">{policy.provider} • {policy.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Annual Premium</p>
                        <p className="font-semibold text-slate-900">{formatCurrency(policy.premium)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Coverage</p>
                        <p className="font-semibold text-slate-900">{formatCurrency(policy.coverage)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Renewal</p>
                        <p className="font-semibold text-slate-900">{formatDate(policy.renewalDate)}</p>
                      </div>
                      <Badge className={getStatusColor(policy.status)}>
                        {getStatusIcon(policy.status)}
                        <span className="ml-1 capitalize">{policy.status}</span>
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

        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No policies found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or add your first policy.</p>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
