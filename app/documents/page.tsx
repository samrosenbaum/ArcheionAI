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
  Download,
  Share2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Folder,
  Upload,
  Camera,
  MessageSquare,
  MoreHorizontal,
  SortAsc,
  SortDesc
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  category: string
  assetId?: string
  assetName?: string
  uploadDate: string
  expiryDate?: string
  status: 'valid' | 'expired' | 'expiring_soon' | 'pending_review' | 'archived'
  tags: string[]
  size: string
  fileType: string
  description?: string
  priority: 'high' | 'medium' | 'low'
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "priority">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const categories = [
    { id: "all", name: "All Documents", icon: FileText, color: "bg-slate-600" },
    { id: "real-estate", name: "Real Estate", icon: FileText, color: "bg-blue-600" },
    { id: "investments", name: "Investments", icon: FileText, color: "bg-green-600" },
    { id: "crypto", name: "Cryptocurrency", icon: FileText, color: "bg-orange-600" },
    { id: "business", name: "Business & LLCs", icon: FileText, color: "bg-purple-600" },
    { id: "insurance", name: "Insurance", icon: FileText, color: "bg-red-600" },
    { id: "tax", name: "Tax Documents", icon: FileText, color: "bg-indigo-600" },
    { id: "vehicles", name: "Vehicles", icon: FileText, color: "bg-teal-600" },
    { id: "family", name: "Family Documents", icon: FileText, color: "bg-pink-600" },
    { id: "trusts", name: "Trusts & Estates", icon: FileText, color: "bg-amber-600" }
  ]

  const statuses = [
    { id: "all", name: "All Statuses", color: "bg-slate-600" },
    { id: "valid", name: "Valid", color: "bg-green-600" },
    { id: "expiring_soon", name: "Expiring Soon", color: "bg-yellow-600" },
    { id: "expired", name: "Expired", color: "bg-red-600" },
    { id: "pending_review", name: "Pending Review", color: "bg-blue-600" },
    { id: "archived", name: "Archived", color: "bg-gray-600" }
  ]

  const documents: Document[] = [
    {
      id: "1",
      name: "Property Deed - Primary Residence",
      type: "Deed",
      category: "real-estate",
      assetId: "1",
      assetName: "Primary Residence",
      uploadDate: "2024-01-15",
      status: "valid",
      tags: ["deed", "property", "primary-home", "legal"],
      size: "2.4 MB",
      fileType: "PDF",
      description: "Official property deed for primary residence in Beverly Hills",
      priority: "high"
    },
    {
      id: "2",
      name: "LLC Operating Agreement",
      type: "Legal Document",
      category: "business",
      assetId: "4",
      assetName: "Tech Startup LLC",
      uploadDate: "2024-01-10",
      status: "valid",
      tags: ["llc", "operating-agreement", "legal", "business"],
      size: "1.8 MB",
      fileType: "PDF",
      description: "Operating agreement for Tech Startup LLC",
      priority: "high"
    },
    {
      id: "3",
      name: "Insurance Policy - Umbrella",
      type: "Policy Document",
      category: "insurance",
      assetId: "5",
      assetName: "Umbrella Insurance",
      uploadDate: "2024-01-05",
      status: "expiring_soon",
      expiryDate: "2024-06-15",
      tags: ["insurance", "umbrella", "liability", "policy"],
      size: "3.2 MB",
      fileType: "PDF",
      description: "Umbrella insurance policy for personal liability protection",
      priority: "high"
    },
    {
      id: "4",
      name: "2023 Tax Return",
      type: "Tax Filing",
      category: "tax",
      uploadDate: "2024-01-12",
      status: "valid",
      tags: ["tax", "return", "2023", "filing"],
      size: "4.1 MB",
      fileType: "PDF",
      description: "Complete 2023 tax return documentation",
      priority: "medium"
    },
    {
      id: "5",
      name: "Investment Portfolio Statement",
      type: "Financial Statement",
      category: "investments",
      assetId: "2",
      assetName: "Investment Portfolio",
      uploadDate: "2024-01-20",
      status: "valid",
      tags: ["investment", "portfolio", "statement", "financial"],
      size: "1.5 MB",
      fileType: "PDF",
      description: "Current investment portfolio statement and performance",
      priority: "medium"
    },
    {
      id: "6",
      name: "Bitcoin Wallet Backup",
      type: "Digital Asset",
      category: "crypto",
      assetId: "3",
      assetName: "Bitcoin Holdings",
      uploadDate: "2024-01-18",
      status: "valid",
      tags: ["bitcoin", "wallet", "backup", "crypto", "digital"],
      size: "0.8 MB",
      fileType: "TXT",
      description: "Encrypted backup of Bitcoin wallet seed phrase",
      priority: "high"
    },
    {
      id: "7",
      name: "Vehicle Registration - Ferrari",
      type: "Registration",
      category: "vehicles",
      assetId: "6",
      assetName: "Luxury Vehicle Collection",
      uploadDate: "2024-01-12",
      status: "expired",
      expiryDate: "2023-12-31",
      tags: ["vehicle", "registration", "ferrari", "luxury"],
      size: "1.2 MB",
      fileType: "PDF",
      description: "Vehicle registration for Ferrari in collection",
      priority: "high"
    },
    {
      id: "8",
      name: "Trust Fund Agreement",
      type: "Legal Document",
      category: "trusts",
      assetId: "7",
      assetName: "Family Trust Fund",
      uploadDate: "2024-01-08",
      status: "valid",
      tags: ["trust", "agreement", "legal", "family", "estate"],
      size: "5.6 MB",
      fileType: "PDF",
      description: "Complete trust fund agreement and terms",
      priority: "high"
    }
  ]

  const filteredDocuments = documents.filter(doc => 
    (selectedCategory === "all" || doc.category === selectedCategory) &&
    (selectedStatus === "all" || doc.status === selectedStatus) &&
    (searchQuery === "" || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.assetName && doc.assetName.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "date":
        comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        break
      case "size":
        comparison = parseFloat(a.size) - parseFloat(b.size)
        break
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800'
      case 'expiring_soon': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'pending_review': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle size={16} />
      case 'expiring_soon': return <Clock size={16} />
      case 'expired': return <AlertTriangle size={16} />
      case 'pending_review': return <Eye size={16} />
      case 'archived': return <Folder size={16} />
      default: return <AlertTriangle size={16} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-600" />
      case 'jpg':
      case 'jpeg':
      case 'png': return <FileText className="w-5 h-5 text-blue-600" />
      case 'txt': return <FileText className="w-5 h-5 text-green-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const totalDocuments = documents.length
  const expiredDocuments = documents.filter(doc => doc.status === 'expired').length
  const expiringSoon = documents.filter(doc => doc.status === 'expiring_soon').length

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
            Document Vault
          </h1>
          <p className="text-slate-600 mb-6">
            Secure storage and organization for all your important documents
          </p>
          
          {/* Document Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Documents</p>
                    <p className="text-2xl font-bold text-blue-900">{totalDocuments}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Valid Documents</p>
                    <p className="text-2xl font-bold text-green-900">{documents.filter(d => d.status === 'valid').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 mb-1">Expiring Soon</p>
                    <p className="text-2xl font-bold text-yellow-900">{expiringSoon}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">Expired</p>
                    <p className="text-2xl font-bold text-red-900">{expiredDocuments}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
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
              placeholder="Search documents by name, tags, or asset..."
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
              Upload Document
            </Button>
          </div>
        </div>

        {/* Category & Status Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-slate-700 mr-2">Categories:</span>
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
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-700 mr-2">Status:</span>
            {statuses.map((status) => (
              <Button
                key={status.id}
                variant={selectedStatus === status.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status.id)}
                className="flex items-center gap-2"
              >
                <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                {status.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600">
            Showing {sortedDocuments.length} of {totalDocuments} documents
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "date" | "size" | "priority")}
              className="text-sm border border-slate-200 rounded-md px-2 py-1"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
              <option value="priority">Priority</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDocuments.map((doc) => (
            <Card key={doc.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getFileTypeIcon(doc.fileType)}
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {doc.type}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(doc.status)}>
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 capitalize">{doc.status.replace('_', ' ')}</span>
                    </Badge>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {doc.description && (
                  <p className="text-slate-600 text-sm mb-4">
                    {doc.description}
                  </p>
                )}
                
                {doc.assetName && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-1">Linked Asset:</p>
                    <p className="text-sm font-medium text-slate-900">{doc.assetName}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>
                  <span>{doc.size}</span>
                </div>
                
                {doc.expiryDate && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-1">Expires:</p>
                    <p className={`text-sm font-medium ${
                      doc.status === 'expired' ? 'text-red-600' : 
                      doc.status === 'expiring_soon' ? 'text-yellow-600' : 'text-slate-900'
                    }`}>
                      {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getPriorityColor(doc.priority)}>
                    {doc.priority} Priority
                  </Badge>
                  <span className="text-xs text-slate-500">{doc.fileType}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded text-xs">
                      +{doc.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? `No documents match "${searchQuery}"` : "Get started by uploading your first document"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Photo Capture
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS Upload
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
