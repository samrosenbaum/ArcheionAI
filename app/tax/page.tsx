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
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Grid,
  List,
  Plus,
  Eye,
  Edit,
  DollarSign
} from "lucide-react"

export default function TaxPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const years = ["2024", "2023", "2022", "2021", "2020"]
  const statuses = [
    { id: "all", name: "All Statuses", color: "bg-slate-600" },
    { id: "pending", name: "Pending", color: "bg-slate-600" },
    { id: "filed", name: "Filed", color: "bg-slate-600" },
    { id: "overdue", name: "Overdue", color: "bg-slate-600" },
    { id: "extension", name: "Extension", color: "bg-slate-600" }
  ]

  const taxDocuments = [
    {
      id: "1",
      name: "2024 Personal Tax Return",
      type: "1040",
      year: "2024",
      status: "pending",
      dueDate: "2025-04-15",
      documents: 12,
      estimatedRefund: 2500,
      category: "Personal"
    },
    {
      id: "2",
      name: "2024 Business Tax Return",
      type: "1120S",
      year: "2024",
      status: "pending",
      dueDate: "2025-03-15",
      documents: 8,
      estimatedRefund: 0,
      category: "Business"
    },
    {
      id: "3",
      name: "2023 Personal Tax Return",
      type: "1040",
      year: "2023",
      status: "filed",
      dueDate: "2024-04-15",
      documents: 10,
      actualRefund: 1800,
      category: "Personal"
    },
    {
      id: "4",
      name: "2023 Business Tax Return",
      type: "1120S",
      year: "2023",
      status: "filed",
      dueDate: "2024-03-15",
      documents: 6,
      actualRefund: 0,
      category: "Business"
    },
    {
      id: "5",
      name: "2024 Q1 Estimated Tax Payment",
      type: "1040-ES",
      year: "2024",
      status: "filed",
      dueDate: "2024-04-15",
      documents: 3,
      amount: 5000,
      category: "Estimated"
    },
    {
      id: "6",
      name: "2024 Q2 Estimated Tax Payment",
      type: "1040-ES",
      year: "2024",
      status: "pending",
      dueDate: "2024-06-15",
      documents: 3,
      amount: 5000,
      category: "Estimated"
    }
  ]

  const deadlines = [
    {
      id: 1,
      title: "Q2 Estimated Tax Payment",
      dueDate: "2024-06-15",
      type: "Estimated Tax",
      status: "upcoming",
      daysUntil: 45
    },
    {
      id: 2,
      title: "Q3 Estimated Tax Payment",
      dueDate: "2024-09-15",
      type: "Estimated Tax",
      status: "upcoming",
      daysUntil: 137
    },
    {
      id: 3,
      title: "Q4 Estimated Tax Payment",
      dueDate: "2025-01-15",
      type: "Estimated Tax",
      status: "upcoming",
      daysUntil: 259
    },
    {
      id: 4,
      title: "2024 Personal Tax Return",
      dueDate: "2025-04-15",
      type: "Annual Return",
      status: "upcoming",
      daysUntil: 349
    }
  ]

  const summary = {
    totalDocuments: taxDocuments.length,
    pending: taxDocuments.filter(doc => doc.status === 'pending').length,
    filed: taxDocuments.filter(doc => doc.status === 'filed').length,
    overdue: taxDocuments.filter(doc => doc.status === 'overdue').length,
    totalRefund: taxDocuments.reduce((sum, doc) => sum + (doc.estimatedRefund || doc.actualRefund || 0), 0)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'filed': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'overdue': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'extension': return 'bg-slate-50 text-slate-700 border-slate-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getDeadlineColor = (daysUntil: number) => {
    if (daysUntil <= 30) return 'text-slate-900'
    if (daysUntil <= 90) return 'text-slate-700'
    return 'text-slate-600'
  }

  const filteredDocuments = taxDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus
    const matchesYear = doc.year === selectedYear
    return matchesSearch && matchesStatus && matchesYear
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tax Management</h1>
          <p className="text-slate-600">Organize and track your tax documents, deadlines, and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.totalDocuments}</p>
              <p className="text-sm text-slate-600">Total Returns</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.pending}</p>
              <p className="text-sm text-slate-600">Pending</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.filed}</p>
              <p className="text-sm text-slate-600">Filed</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{summary.overdue}</p>
              <p className="text-sm text-slate-600">Overdue</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalRefund)}</p>
              <p className="text-sm text-slate-600">Total Refund</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tax documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Tax Return
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tax Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                  <span className="text-sm text-slate-500">{doc.year}</span>
                </div>
                <CardTitle className="text-lg">{doc.name}</CardTitle>
                <CardDescription>{doc.category} • {doc.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Due Date</span>
                    <span className="font-medium text-slate-900">{formatDate(doc.dueDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Documents</span>
                    <span className="font-medium text-slate-900">{doc.documents}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {doc.status === 'filed' ? 'Refund' : 'Estimated Refund'}
                    </span>
                    <span className={`font-medium ${
                      (doc.estimatedRefund || doc.actualRefund || 0) > 0 ? 'text-slate-900' : 'text-slate-600'
                    }`}>
                      {formatCurrency(doc.estimatedRefund || doc.actualRefund || 0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-300">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-300">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Deadlines */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-slate-700" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
            <CardDescription>Important tax dates to remember</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{deadline.title}</h4>
                      <p className="text-sm text-slate-600">{deadline.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{formatDate(deadline.dueDate)}</p>
                    <p className={`text-sm ${getDeadlineColor(deadline.daysUntil)}`}>
                      {deadline.daysUntil} days away
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
