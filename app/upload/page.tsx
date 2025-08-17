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
import { DocumentParser, ParsedDocument } from "@/lib/document-parser"
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
  Mail,
  Edit,
  Save,
  X,
  Brain,
  Calendar,
  DollarSign,
  Tag
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'drag-drop' | 'camera' | 'sms' | 'email'>('drag-drop')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [parsingResults, setParsingResults] = useState<Record<string, ParsedDocument>>({})
  const [isParsing, setIsParsing] = useState(false)
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
      id: "career",
      name: "Career & Licenses",
      subcategories: ["Professional Licenses", "Certifications", "Continuing Education", "Training Records", "Performance Reviews"]
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
    console.log('File input change event:', e.target.files) // Debug log
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    console.log('Handling files:', files.length, 'files') // Debug log
    
    try {
      for (const file of Array.from(files)) {
        console.log('Processing file:', file.name, file.size, file.type) // Debug log
        
        // Create initial file object with original name
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
        
        // Start parsing the document
        await parseDocument(file, newFile.id)
        
        try {
          // Upload file using the service
          const uploadOptions: FileUploadOptions = {
            category: newFile.category || undefined,
            subcategory: newFile.subcategory || undefined,
            tags: newFile.tags,
            description: newFile.description,
            assetId: newFile.assetId
          }
          
          console.log('Starting upload with options:', uploadOptions) // Debug log
          console.log('User ID:', user.id) // Debug log
          
          const uploadedFile = await FileUploadService.uploadFile(file, user.id, uploadOptions)
          
          console.log('Upload successful:', uploadedFile) // Debug log
          
          // Update the file with the uploaded data
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id ? { ...uploadedFile, id: f.id } : f
          ))
          
          toast({
            title: "Upload successful",
            description: `${file.name} has been uploaded and parsed successfully.`,
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
    } catch (error) {
      console.error('File handling error:', error)
      toast({
        title: "Error",
        description: "Failed to process files",
        variant: "destructive",
      })
    }
  }

  const parseDocument = async (file: File, fileId: string) => {
    try {
      setIsParsing(true)
      console.log('Starting document parsing for:', file.name)
      
      const parsedDocument = await DocumentParser.parseDocument(file, user.id)
      setParsingResults(prev => ({ ...prev, [fileId]: parsedDocument }))
      
      // Auto-categorize based on parsing results
      if (parsedDocument.extractedData.categories.length > 0) {
        const primaryCategory = parsedDocument.extractedData.categories[0]
        const category = categories.find(cat => cat.id === primaryCategory)
        
        if (category) {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, category: category.name, subcategory: category.subcategories[0] || '' }
              : f
          ))
        }
      }
      
      console.log('Document parsing completed:', parsedDocument)
      
    } catch (error) {
      console.error('Document parsing error:', error)
      toast({
        title: "Parsing failed",
        description: "Failed to parse document content",
        variant: "destructive",
      })
    } finally {
      setIsParsing(false)
    }
  }

  const startEditing = (fileId: string) => {
    setEditingFile(fileId)
  }

  const saveEditing = (fileId: string) => {
    setEditingFile(null)
    toast({
      title: "File updated",
      description: "File information has been updated successfully.",
    })
  }

  const cancelEditing = () => {
    setEditingFile(null)
  }

  const updateFileMetadata = (fileId: string, field: keyof UploadedFile, value: any) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, [field]: value } : file
    ))
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
      case 'uploading': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'processing': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'completed': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'error': return 'bg-slate-100 text-slate-800 border-slate-300'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    setParsingResults(prev => {
      const newResults = { ...prev }
      delete newResults[fileId]
      return newResults
    })
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
            Securely add documents to your vault with intelligent categorization and parsing
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
                    className="h-20 flex-col space-y-2"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Drag & Drop</span>
                  </Button>
                  
                  <Button
                    variant={uploadMethod === 'camera' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('camera')}
                    className="h-20 flex-col space-y-2"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">Camera</span>
                  </Button>
                  
                  <Button
                    variant={uploadMethod === 'sms' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('sms')}
                    className="h-20 flex-col space-y-2"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">SMS</span>
                  </Button>
                  
                  <Button
                    variant={uploadMethod === 'email' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('email')}
                    className="h-20 flex-col space-y-2"
                  >
                    <Mail className="h-6 w-6" />
                    <span className="text-sm">Email</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Drag & Drop Upload Area */}
            {uploadMethod === 'drag-drop' && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-slate-400 bg-slate-50' 
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Drop files here or click to browse
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Upload PDFs, images, and documents up to 50MB
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 hover:bg-slate-800"
                    >
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,.xls,.xlsx"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Camera Upload */}
            {uploadMethod === 'camera' && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Camera Upload</h3>
                  <p className="text-slate-600 mb-4">
                    Take photos of documents directly from your device
                  </p>
                  <Button className="bg-slate-900 hover:bg-slate-800">
                    Open Camera
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* SMS Upload */}
            {uploadMethod === 'sms' && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">SMS Upload</h3>
                  <p className="text-slate-600 mb-4">
                    Send documents via text message to our secure number
                  </p>
                  <div className="space-y-4">
                    <Input placeholder="Enter your phone number" />
                    <Button className="bg-slate-900 hover:bg-slate-800 w-full">
                      Get Upload Number
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Upload */}
            {uploadMethod === 'email' && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <Mail className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Email Upload</h3>
                  <p className="text-slate-600 mb-4">
                    Forward documents to our secure email address
                  </p>
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm font-mono text-slate-700">
                      upload@archeion.ai
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upload Queue & Settings */}
          <div className="space-y-6">
            {/* Upload Queue */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Upload Queue</span>
                  {isParsing && (
                    <Badge variant="secondary" className="ml-2">
                      <Brain className="h-3 w-3 mr-1" />
                      Parsing...
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} in queue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="border border-slate-200 rounded-lg p-3">
                      {/* File Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">
                            {editingFile === file.id ? (
                              <Input
                                value={file.name}
                                onChange={(e) => updateFileMetadata(file.id, 'name', e.target.value)}
                                className="h-6 text-sm"
                              />
                            ) : (
                              file.name
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {editingFile === file.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => saveEditing(file.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEditing}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(file.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(file.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* File Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-2">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.type}</span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(file.status)}>
                          {getStatusIcon(file.status)}
                          <span className="ml-1">{file.status}</span>
                        </Badge>
                        {file.status === 'uploading' && (
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-slate-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Category Selection */}
                      <div className="space-y-2">
                        <Select
                          value={file.category}
                          onValueChange={(value) => updateFileMetadata(file.id, 'category', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {file.category && (
                          <Select
                            value={file.subcategory}
                            onValueChange={(value) => updateFileMetadata(file.id, 'subcategory', value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories
                                .find(cat => cat.name === file.category)
                                ?.subcategories.map((subcategory) => (
                                  <SelectItem key={subcategory} value={subcategory}>
                                    {subcategory}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      {/* Parsing Results */}
                      {parsingResults[file.id] && (
                        <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="h-4 w-4 text-slate-600" />
                            <span className="text-xs font-medium text-slate-700">AI Analysis Results</span>
                            <Badge variant="secondary" className="text-xs">
                              {parsingResults[file.id].confidence}% confidence
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {parsingResults[file.id].extractedData.amounts.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3 text-slate-500" />
                                <span className="text-slate-600">
                                  {parsingResults[file.id].extractedData.amounts.length} amounts found
                                </span>
                              </div>
                            )}
                            
                            {parsingResults[file.id].extractedData.dates.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-slate-500" />
                                <span className="text-slate-600">
                                  {parsingResults[file.id].extractedData.dates.length} dates found
                                </span>
                              </div>
                            )}
                            
                            {parsingResults[file.id].extractedData.categories.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Tag className="h-3 w-3 text-slate-500" />
                                <span className="text-slate-600">
                                  {parsingResults[file.id].extractedData.categories.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {parsingResults[file.id].insights.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-200">
                              <div className="flex items-center space-x-1 mb-1">
                                <AlertTriangle className="h-3 w-3 text-slate-500" />
                                <span className="text-xs font-medium text-slate-700">
                                  {parsingResults[file.id].insights.length} insights found
                                </span>
                              </div>
                              <div className="space-y-1">
                                {parsingResults[file.id].insights.slice(0, 2).map((insight, index) => (
                                  <div key={index} className="text-xs text-slate-600">
                                    • {insight.title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Error Display */}
                      {file.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          {file.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upload Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Upload Settings</CardTitle>
                <CardDescription>Configure your upload preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Default Category</Label>
                  <Select defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="Select default category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Auto-categorization</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input type="checkbox" id="auto-categorize" defaultChecked className="rounded" />
                    <Label htmlFor="auto-categorize" className="text-sm text-slate-600">
                      Use AI to automatically categorize documents
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">File Processing</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input type="checkbox" id="extract-text" defaultChecked className="rounded" />
                    <Label htmlFor="extract-text" className="text-sm text-slate-600">
                      Extract text and data from documents
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
