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
import { FileUploadService, UploadedFile, FileUploadOptions } from "@/lib/file-upload-service"
import { useMockAuth } from "@/lib/auth-context"
import { 
  Upload,
  Camera,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Trash2,
  Eye,
  Download,
  Share2,
  Mail
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'drag-drop' | 'camera' | 'sms' | 'email'>('drag-drop')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useMockAuth()

  const categories = [
    {
      id: "real-estate",
      name: "Real Estate",
      subcategories: ["Primary Home", "Investment Property", "Vacation Home", "Commercial Property", "Land"]
    },
    {
      id: "investments",
      name: "Investments",
      subcategories: ["Stocks & Bonds", "Mutual Funds", "ETFs", "401k/IRA", "Alternative Investments"]
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      subcategories: ["Bitcoin", "Ethereum", "Altcoins", "NFTs", "DeFi Protocols"]
    },
    {
      id: "business",
      name: "Business & LLCs",
      subcategories: ["LLC Documents", "Operating Agreements", "Tax Filings", "Contracts", "Financial Statements"]
    },
    {
      id: "insurance",
      name: "Insurance",
      subcategories: ["Auto Insurance", "Home Insurance", "Life Insurance", "Umbrella Policy", "Health Insurance"]
    },
    {
      id: "tax",
      name: "Tax Documents",
      subcategories: ["Tax Returns", "W-2s", "1099s", "Deductions", "Business Expenses"]
    },
    {
      id: "vehicles",
      name: "Vehicles",
      subcategories: ["Cars", "Motorcycles", "Boats", "Aircraft", "Recreational Vehicles"]
    },
    {
      id: "family",
      name: "Family Documents",
      subcategories: ["Birth Certificates", "Social Security Cards", "Passports", "Marriage License", "Medical Records"]
    },
    {
      id: "trusts",
      name: "Trusts & Estates",
      subcategories: ["Trust Agreements", "Wills", "Power of Attorney", "Healthcare Directives", "Estate Planning"]
    }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    
    try {
      for (const file of Array.from(files)) {
        // Create initial file object
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0,
          category: "",
          subcategory: "",
          tags: [],
          description: '',
          uploadDate: new Date().toISOString()
        }
        
        setUploadedFiles(prev => [...prev, newFile])
        
        try {
          // Upload file using the service
          const uploadOptions: FileUploadOptions = {
            category: newFile.category || undefined,
            subcategory: newFile.subcategory || undefined,
            tags: newFile.tags,
            description: newFile.description,
            assetId: newFile.assetId
          }
          
          const uploadedFile = await FileUploadService.uploadFile(file, user.id, uploadOptions)
          
          // Update the file with the uploaded data
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id ? { ...uploadedFile, id: f.id } : f
          ))
          
          toast({
            title: "Upload successful",
            description: `${file.name} has been uploaded successfully.`,
          })
          
        } catch (error) {
          console.error('Upload error:', error)
          
          // Update file with error status
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
              : f
          ))
          
          toast({
            title: "Upload failed",
            description: error instanceof Error ? error.message : 'Failed to upload file',
            variant: "destructive",
          })
        }
      }
    } finally {
      
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <Clock size={16} />
      case 'processing': return <Clock size={16} />
      case 'completed': return <CheckCircle size={16} />
      case 'error': return <AlertTriangle size={16} />
      default: return <Clock size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const updateFileMetadata = (fileId: string, field: keyof UploadedFile, value: any) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, [field]: value } : file
    ))
  }

  const handleDownload = async (file: UploadedFile) => {
    if (!file.filePath) {
      toast({
        title: "Download failed",
        description: "File path not found",
        variant: "destructive",
      })
      return
    }

    try {
      const url = await FileUploadService.getFileUrl(file.filePath)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate download link",
        variant: "destructive",
      })
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Upload Documents
          </h1>
          <p className="text-slate-600">
            Securely add documents to your vault with intelligent categorization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Method Tabs */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Choose Upload Method</CardTitle>
                <CardDescription>Select how you'd like to add documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant={uploadMethod === 'drag-drop' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('drag-drop')}
                    className="flex flex-col items-center gap-2 h-24"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Drag & Drop</span>
                  </Button>
                  
                  <Button
                    variant={uploadMethod === 'camera' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('camera')}
                    className="flex flex-col items-center gap-2 h-24"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">Photo Capture</span>
                  </Button>
                  
                  <Button
                    variant={uploadMethod === 'sms' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('sms')}
                    className="flex flex-col items-center gap-2 h-24"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">SMS Upload</span>
                  </Button>
                  
                  <Button
                    variant={uploadMethod === 'email' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('email')}
                    className="flex flex-col items-center gap-2 h-24"
                  >
                    <Mail className="h-6 w-6" />
                    <span className="text-sm">Email</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Drag & Drop Upload */}
            {uploadMethod === 'drag-drop' && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Drag & Drop Files</CardTitle>
                  <CardDescription>Drop your documents here or click to browse</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-900 mb-2">
                      Drop files here
                    </p>
                    <p className="text-slate-600 mb-4">
                      or click to browse your computer
                    </p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Camera Upload */}
            {uploadMethod === 'camera' && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Photo Capture</CardTitle>
                  <CardDescription>Take photos of your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      Camera functionality will be available in the mobile app
                    </p>
                    <Button variant="outline">
                      Open Camera
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SMS Upload */}
            {uploadMethod === 'sms' && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>SMS Document Upload</CardTitle>
                  <CardDescription>Send documents via text message</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea id="message" placeholder="Add context about this document..." />
                    </div>
                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Upload Instructions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Upload */}
            {uploadMethod === 'email' && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Email Document Upload</CardTitle>
                  <CardDescription>Send documents via email</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" placeholder="documents@archeion.com" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject (Optional)</Label>
                      <Input id="subject" placeholder="Document upload" />
                    </div>
                    <div>
                      <Label htmlFor="emailMessage">Message (Optional)</Label>
                      <Textarea id="emailMessage" placeholder="Add context about this document..." />
                    </div>
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Upload Instructions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                  <CardDescription>Manage and categorize your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900">{file.name}</p>
                              <p className="text-sm text-slate-500">{formatFileSize(file.size)} • {file.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(file.status)}>
                              {getStatusIcon(file.status)}
                              <span className="ml-1 capitalize">{file.status}</span>
                            </Badge>
                            {file.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(file)}
                                title="Download file"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              title="Remove file"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {file.status === 'error' && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                              <AlertTriangle className="h-4 w-4 inline mr-2" />
                              {file.error || 'Upload failed'}
                            </p>
                          </div>
                        )}

                        {file.status === 'uploading' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-slate-600 mb-1">
                              <span>Uploading...</span>
                              <span>{Math.round(file.progress)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {file.status === 'completed' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`category-${file.id}`}>Category</Label>
                                <Select
                                  value={file.category}
                                  onValueChange={(value) => updateFileMetadata(file.id, 'category', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor={`subcategory-${file.id}`}>Subcategory</Label>
                                <Select
                                  value={file.subcategory}
                                  onValueChange={(value) => updateFileMetadata(file.id, 'subcategory', value)}
                                  disabled={!file.category}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select subcategory" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {file.category && categories
                                      .find(cat => cat.id === file.category)
                                      ?.subcategories.map((sub) => (
                                        <SelectItem key={sub} value={sub}>
                                          {sub}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor={`description-${file.id}`}>Description</Label>
                              <Textarea
                                id={`description-${file.id}`}
                                placeholder="Describe this document..."
                                value={file.description}
                                onChange={(e) => updateFileMetadata(file.id, 'description', e.target.value)}
                              />
                            </div>

                            <div>
                              <Label htmlFor={`tags-${file.id}`}>Tags</Label>
                              <Input
                                id={`tags-${file.id}`}
                                placeholder="Enter tags separated by commas..."
                                value={file.tags.join(', ')}
                                onChange={(e) => updateFileMetadata(file.id, 'tags', e.target.value.split(',').map(tag => tag.trim()))}
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Upload Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Files</span>
                  <span className="font-semibold">{uploadedFiles.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Processing</span>
                  <span className="font-semibold text-yellow-600">
                    {uploadedFiles.filter(f => f.status === 'processing').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {uploadedFiles.filter(f => f.status === 'completed').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Upload Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    Use descriptive names for easier searching
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    Add relevant tags for better organization
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    Categorize documents for automated insights
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    Supported formats: PDF, DOC, JPG, PNG, TXT
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Uploads */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedFiles.slice(0, 3).map((file) => (
                  <div key={file.id} className="flex items-center gap-3 py-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(file.status)}>
                      {file.status}
                    </Badge>
                  </div>
                ))}
                {uploadedFiles.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No files uploaded yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
