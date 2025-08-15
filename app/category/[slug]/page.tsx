"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  Search,
  Eye,
  Download,
  Trash2,
  Plus,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DocumentStorageService } from "@/lib/document-storage"
import type { Document, DocumentInsight } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const categoryConfig = {
  insurance: {
    name: "Insurance",
    icon: "Shield",
    color: "from-blue-500 to-indigo-600",
    description: "Manage your insurance policies and coverage documents",
    subcategories: ["Home", "Auto", "Life", "Umbrella", "Health", "Disability"],
  },
  tax: {
    name: "Tax Documents",
    icon: "FileText",
    color: "from-emerald-500 to-teal-600",
    description: "Organize tax returns, receipts, and tax-related documents",
    subcategories: ["Federal Return", "State Return", "Receipts", "1099s", "W2s", "Deductions"],
  },
  "real-estate": {
    name: "Real Estate",
    icon: "Home",
    color: "from-purple-500 to-violet-600",
    description: "Property deeds, mortgages, and real estate investments",
    subcategories: ["Deed", "Mortgage", "Insurance", "Tax Records", "Inspection", "Appraisal"],
  },
  vehicle: {
    name: "Vehicles",
    icon: "Car",
    color: "from-orange-500 to-red-500",
    description: "Vehicle titles, registrations, and automotive documents",
    subcategories: ["Title", "Registration", "Insurance", "Maintenance", "Purchase", "Loan"],
  },
  business: {
    name: "Business",
    icon: "Building",
    color: "from-rose-500 to-pink-600",
    description: "Business formation, operating agreements, and corporate documents",
    subcategories: ["Formation", "Operating Agreement", "Tax Returns", "Contracts", "Licenses", "Insurance"],
  },
  personal: {
    name: "Personal",
    icon: "Users",
    color: "from-cyan-500 to-blue-500",
    description: "Personal documents, identification, and miscellaneous files",
    subcategories: ["ID Documents", "Medical", "Legal", "Financial", "Education", "Other"],
  },
}

interface UploadedFile {
  file: File
  id: string
  progress: number
  status: "uploading" | "processing" | "complete" | "error"
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const category = categoryConfig[slug as keyof typeof categoryConfig]

  const [documents, setDocuments] = useState<Document[]>([])
  const [insights, setInsights] = useState<DocumentInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadSubcategory, setUploadSubcategory] = useState("")

  useEffect(() => {
    if (category) {
      loadCategoryData()
    }
  }, [slug])

  const loadCategoryData = async () => {
    setLoading(true)
    try {
      // Mock user ID - in real app, get from auth
      const userId = "mock-user-id"

      const { data: docs } = await DocumentStorageService.getDocumentsByCategory(userId, slug)
      const { data: categoryInsights } = await DocumentStorageService.getDocumentInsights(userId)

      setDocuments(docs)
      setInsights(categoryInsights.filter((insight) => insight.category.toLowerCase() === category.name.toLowerCase()))
    } catch (error) {
      console.error("Failed to load category data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: File[]) => {
    const userId = "mock-user-id" // In real app, get from auth

    for (const file of files) {
      const fileId = Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        file,
        id: fileId,
        progress: 0,
        status: "uploading",
      }

      setUploadedFiles((prev) => [...prev, newFile])

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f)),
          )
        }, 200)

        // Upload document
        const { error } = await DocumentStorageService.uploadDocument(
          file,
          userId,
          slug,
          uploadSubcategory || undefined,
          [],
        )

        clearInterval(progressInterval)

        if (error) {
          setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", progress: 100 } : f)))
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: "complete", progress: 100 } : f)),
          )

          // Refresh documents list
          setTimeout(() => {
            loadCategoryData()
            setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
          }, 2000)
        }
      } catch (error) {
        console.error("Upload failed:", error)
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", progress: 100 } : f)))
      }
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubcategory = selectedSubcategory === "all" || doc.subcategory === selectedSubcategory
    return matchesSearch && matchesSubcategory
  })

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Category Not Found</h1>
          <p className="text-slate-600 mb-4">The requested category does not exist.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div
              className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{category.name}</h1>
              <p className="text-slate-600">{category.description}</p>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload {category.name} Documents</DialogTitle>
                  <DialogDescription>Upload documents for analysis and optimization insights</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors"
                    onDrop={(e) => {
                      e.preventDefault()
                      const files = Array.from(e.dataTransfer.files)
                      handleFileUpload(files)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">Drop files here or click to browse</p>
                    <Button size="sm" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                      Choose Files
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={uploadSubcategory} onValueChange={setUploadSubcategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {category.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub.toLowerCase()}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-2 border rounded">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{file.file.name}</div>
                            <Progress value={file.progress} className="h-1 mt-1" />
                          </div>
                          <Badge variant={file.status === "error" ? "destructive" : "secondary"}>{file.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Documents</p>
                  <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
                </div>
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Insights</p>
                  <p className="text-2xl font-bold text-slate-900">{insights.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Potential Savings</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${insights.reduce((sum, insight) => sum + (insight.potential_savings || 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Last Updated</p>
                  <p className="text-2xl font-bold text-slate-900">Today</p>
                </div>
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={`Search ${category.name.toLowerCase()} documents...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {category.subcategories.map((sub) => (
                <SelectItem key={sub} value={sub.toLowerCase()}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Insights */}
        {insights.length > 0 && (
          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {category.name} Insights
              </CardTitle>
              <CardDescription>AI-powered analysis of your {category.name.toLowerCase()} documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      insight.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : insight.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                    {insight.potential_savings && (
                      <p className="text-sm font-medium text-emerald-600 mt-2">
                        Potential savings: ${insight.potential_savings.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={insight.priority === "high" ? "destructive" : "secondary"}>
                    {insight.priority} priority
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Documents List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              {filteredDocuments.length} of {documents.length} documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No documents found</h3>
                <p className="text-slate-600 mb-4">
                  {searchQuery || selectedSubcategory !== "all"
                    ? "Try adjusting your search or filters"
                    : `Upload your first ${category.name.toLowerCase()} document to get started`}
                </p>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center shadow-sm`}
                    >
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">{doc.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                        <span>{doc.file_type.toUpperCase()}</span>
                        <span>•</span>
                        <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                        {doc.subcategory && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {doc.subcategory}
                            </Badge>
                          </>
                        )}
                        <span>•</span>
                        <span>Uploaded {new Date(doc.upload_date).toLocaleDateString()}</span>
                      </div>
                      {doc.insights_count > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs text-emerald-600 font-medium">
                            {doc.insights_count} insight{doc.insights_count > 1 ? "s" : ""} generated
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          doc.status === "analyzed"
                            ? "secondary"
                            : doc.status === "processing"
                              ? "outline"
                              : doc.status === "error"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {doc.status}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
