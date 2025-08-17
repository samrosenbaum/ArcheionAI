"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { useMockAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { 
  GraduationCap,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  SortAsc,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Target,
  BookOpen,
  Award,
  Shield,
  Building,
  UserCheck,
  FileText
} from "lucide-react"

interface CareerLicense {
  id: string
  name: string
  licenseNumber?: string
  issuingOrganization: string
  category: string
  subcategory?: string
  issueDate: string
  expirationDate: string
  renewalFrequencyMonths: number
  renewalRequirements: string[]
  continuingEducationHoursRequired: number
  continuingEducationHoursCompleted: number
  status: 'active' | 'expired' | 'pending_renewal' | 'suspended'
  priority: 'high' | 'medium' | 'low'
  notes?: string
  daysUntilExpiration: number
  renewalStatus: 'on_track' | 'due_soon' | 'overdue' | 'completed'
}

interface ContinuingEducation {
  id: string
  activityName: string
  provider: string
  hoursEarned: number
  activityDate: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

export default function CareerPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("expiration")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddLicense, setShowAddLicense] = useState(false)
  const [showAddCE, setShowAddCE] = useState(false)
  const { user } = useMockAuth()
  const { toast } = useToast()

  // Mock data - replace with actual Supabase queries
  const mockLicenses: CareerLicense[] = [
    {
      id: "1",
      name: "CPR Certification",
      licenseNumber: "CPR-2024-001",
      issuingOrganization: "American Heart Association",
      category: "Healthcare",
      subcategory: "Emergency Care",
      issueDate: "2024-01-15",
      expirationDate: "2026-01-15",
      renewalFrequencyMonths: 24,
      renewalRequirements: ["CPR Course", "Written Exam"],
      continuingEducationHoursRequired: 0,
      continuingEducationHoursCompleted: 0,
      status: "active",
      priority: "high",
      daysUntilExpiration: 730,
      renewalStatus: "on_track"
    },
    {
      id: "2",
      name: "Physical Therapist License",
      licenseNumber: "PT-12345",
      issuingOrganization: "State Board of Physical Therapy",
      category: "Healthcare",
      subcategory: "Physical Therapy",
      issueDate: "2023-06-01",
      expirationDate: "2025-06-01",
      renewalFrequencyMonths: 24,
      renewalRequirements: ["Continuing Education", "License Renewal Fee"],
      continuingEducationHoursRequired: 30,
      continuingEducationHoursCompleted: 15,
      status: "active",
      priority: "high",
      daysUntilExpiration: 365,
      renewalStatus: "due_soon"
    },
    {
      id: "3",
      name: "Real Estate License",
      licenseNumber: "RE-98765",
      issuingOrganization: "State Real Estate Commission",
      category: "Real Estate",
      subcategory: "Sales",
      issueDate: "2022-12-01",
      expirationDate: "2024-12-01",
      renewalFrequencyMonths: 24,
      renewalRequirements: ["Continuing Education", "Background Check", "Renewal Fee"],
      continuingEducationHoursRequired: 15,
      continuingEducationHoursCompleted: 15,
      status: "pending_renewal",
      priority: "high",
      daysUntilExpiration: 30,
      renewalStatus: "due_soon"
    }
  ]

  const mockCEActivities: ContinuingEducation[] = [
    {
      id: "1",
      activityName: "Advanced Physical Therapy Techniques",
      provider: "APTA",
      hoursEarned: 8,
      activityDate: "2024-03-15",
      category: "Clinical Skills",
      status: "approved"
    },
    {
      id: "2",
      activityName: "Ethics in Healthcare",
      provider: "State Medical Board",
      hoursEarned: 4,
      activityDate: "2024-02-20",
      category: "Ethics",
      status: "approved"
    }
  ]

  const categories = [
    { id: "healthcare", name: "Healthcare", icon: Shield, color: "from-slate-500 to-slate-600" },
    { id: "legal", name: "Legal", icon: Building, color: "from-slate-500 to-slate-600" },
    { id: "real-estate", name: "Real Estate", icon: Building, color: "from-slate-500 to-slate-600" },
    { id: "finance", name: "Finance", icon: Target, color: "from-slate-500 to-slate-600" },
    { id: "education", name: "Education", icon: GraduationCap, color: "from-slate-500 to-slate-600" },
    { id: "technology", name: "Technology", icon: Target, color: "from-slate-500 to-slate-600" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'expired': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'pending_renewal': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'suspended': return 'bg-slate-100 text-slate-800 border-slate-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'medium': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'low': return 'bg-slate-100 text-slate-800 border-slate-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getCEStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'due_soon': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'overdue': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'completed': return 'bg-slate-100 text-slate-800 border-slate-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date()
    const expiration = new Date(expirationDate)
    const diffTime = expiration.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getRenewalStatus = (daysUntilExpiration: number) => {
    if (daysUntilExpiration < 0) return 'overdue'
    if (daysUntilExpiration <= 30) return 'due_soon'
    if (daysUntilExpiration <= 90) return 'due_soon'
    return 'on_track'
  }

  const filteredLicenses = mockLicenses.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.issuingOrganization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || license.category.toLowerCase() === filterCategory
    const matchesStatus = filterStatus === "all" || license.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const sortedLicenses = [...filteredLicenses].sort((a, b) => {
    switch (sortBy) {
      case "expiration":
        return getDaysUntilExpiration(a.expirationDate) - getDaysUntilExpiration(b.expirationDate)
      case "name":
        return a.name.localeCompare(b.name)
      case "category":
        return a.category.localeCompare(b.category)
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  const upcomingRenewals = mockLicenses.filter(license => 
    getDaysUntilExpiration(license.expirationDate) <= 90
  )

  const totalCEHours = mockLicenses.reduce((total, license) => 
    total + license.continuingEducationHoursCompleted, 0
  )

  const totalRequiredCEHours = mockLicenses.reduce((total, license) => 
    total + license.continuingEducationHoursRequired, 0
  )

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Career & Licenses
              </h1>
              <p className="text-slate-600">
                Manage your professional certifications, track renewal dates, and monitor continuing education
              </p>
            </div>
            <Button onClick={() => setShowAddLicense(true)} className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add License
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Licenses</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {mockLicenses.filter(l => l.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Due Soon</p>
                  <p className="text-2xl font-bold text-slate-700">
                    {upcomingRenewals.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">CE Hours</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalCEHours}/{totalRequiredCEHours}
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Categories</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {new Set(mockLicenses.map(l => l.category)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search licenses, organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiration">Expiration Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <div className="grid grid-cols-2 gap-1 w-4 h-4">
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                  </div>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <div className="flex flex-col gap-1 w-4 h-4">
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                    <div className="w-4 h-1 bg-current rounded-sm"></div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Licenses Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedLicenses.map((license) => (
              <Card key={license.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{license.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(license.status)}>
                          {license.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(license.priority)}>
                          {license.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{license.issuingOrganization}</span>
                    </div>
                    
                    {license.licenseNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{license.licenseNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        Expires: {new Date(license.expirationDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {license.daysUntilExpiration > 0 
                          ? `${license.daysUntilExpiration} days remaining`
                          : `${Math.abs(license.daysUntilExpiration)} days overdue`
                        }
                      </span>
                    </div>

                    {license.continuingEducationHoursRequired > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">
                          CE: {license.continuingEducationHoursCompleted}/{license.continuingEducationHoursRequired} hours
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <Badge className={getCEStatusColor(license.renewalStatus)}>
                        {license.renewalStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm mb-8">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        License
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Expiration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        CE Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {sortedLicenses.map((license) => (
                      <tr key={license.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{license.name}</div>
                            {license.licenseNumber && (
                              <div className="text-sm text-slate-500">{license.licenseNumber}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {license.issuingOrganization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{license.category}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(license.status)}>
                            {license.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {new Date(license.expirationDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-slate-500">
                            {license.daysUntilExpiration > 0 
                              ? `${license.daysUntilExpiration} days remaining`
                              : `${Math.abs(license.daysUntilExpiration)} days overdue`
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {license.continuingEducationHoursRequired > 0 ? (
                            <span>
                              {license.continuingEducationHoursCompleted}/{license.continuingEducationHoursRequired}
                            </span>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continuing Education Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Continuing Education</h2>
            <Button onClick={() => setShowAddCE(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add CE Activity
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCEActivities.map((activity) => (
              <Card key={activity.id} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{activity.activityName}</CardTitle>
                  <div className="flex items-center gap-2">
                                      <Badge className={activity.status === 'approved' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-50 text-slate-700 border-slate-200'}>
                    {activity.status}
                  </Badge>
                    <Badge variant="outline">{activity.hoursEarned} hours</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{activity.provider}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {new Date(activity.activityDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{activity.category}</span>
                    </div>

                    {activity.notes && (
                      <div className="text-sm text-slate-600 pt-2 border-t border-slate-200">
                        {activity.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6" />
                <span>View Calendar</span>
              </Button>
              
              <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Renewal Alerts</span>
              </Button>
              
              <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                <BookOpen className="h-6 w-6" />
                <span>CE Tracker</span>
              </Button>
              
              <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                <Download className="h-6 w-6" />
                <span>Export Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
