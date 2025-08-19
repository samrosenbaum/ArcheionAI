"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { FileUploadService, UploadedFile } from "@/lib/file-upload-service"
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
  const [assetName, setAssetName] = useState('')
  const [assetCategory, setAssetCategory] = useState('')
  const [assetSubcategory, setAssetSubcategory] = useState('')
  const [showAssetNaming, setShowAssetNaming] = useState(true) // Show by default
  const [suggestedAssetNames, setSuggestedAssetNames] = useState<string[]>([])
  const [customCategories, setCustomCategories] = useState<Array<{id: string, name: string, subcategories: string[]}>>([])
  const [showCustomCategoryForm, setShowCustomCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubcategories, setNewSubcategories] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useMockAuth()



  // Handle submitting all completed files to Supabase
  const handleSubmitAll = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to upload documents",
        variant: "destructive",
      })
      return
    }

    const completedFiles = uploadedFiles.filter(f => f.status === 'completed')
    if (completedFiles.length === 0) {
      toast({
        title: "No Files Ready",
        description: "All files must be processed before submitting",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "Saving Documents",
        description: `Saving ${completedFiles.length} documents to your vault...`,
      })

      // Save each completed file using the new service
      for (const file of completedFiles) {
        try {
          // We need the original File object, not the UploadedFile metadata
          // This should be stored when the file is first added
          const originalFile = file.originalFile
          if (!originalFile) {
            throw new Error('Original file not found')
          }

          // Use the new FileUploadService to handle everything
          const uploadedFile = await FileUploadService.uploadFile(originalFile, user.id, {
            category: file.category,
            subcategory: file.subcategory,
            tags: file.tags,
            description: file.description,
            assetName: assetName
          })

          // Update file status to saved
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'saved' as const } : f
          ))

          console.log('File successfully uploaded:', uploadedFile)

        } catch (error) {
          console.error(`Error saving file ${file.name}:`, error)
          // Update file status to error
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Save failed' } : f
          ))
        }
      }

      // Show success message
      const savedCount = uploadedFiles.filter(f => f.status === 'saved').length
      toast({
        title: "Documents Saved!",
        description: `Successfully saved ${savedCount} documents to your vault`,
      })

      // Clear completed files after successful save
      setUploadedFiles(prev => prev.filter(f => f.status !== 'saved'))
      setParsingResults({})
      setAssetName('')

    } catch (error) {
      console.error('Submit all error:', error)
      toast({
        title: "Save Failed",
        description: "Failed to save some documents. Please try again.",
        variant: "destructive",
      })
    }
  }

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
    },
    {
      id: "pets",
      name: "Pets & Animals",
      subcategories: ["Vaccination Records", "Adoption Papers", "Pet Insurance", "Veterinary Records", "Microchip Info", "Training Certificates"]
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
        
        // Create initial file object with original file stored
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0,
          category: assetCategory || "",
          subcategory: assetSubcategory || "",
          tags: [],
          description: '',
          uploadDate: new Date().toISOString(),
          originalFile: file // Store the original File object
        }
        
        setUploadedFiles(prev => [...prev, newFile])
        
        // Start parsing the document (don't upload yet)
        await parseDocument(file, newFile.id)
        
        // Mark as completed - ready for batch upload
        setUploadedFiles(prev => {
          const updated = prev.map(f => 
            f.id === newFile.id ? { ...f, status: 'completed' as const } : f
          )
          console.log('Updated file status to completed:', newFile.name, 'New status:', updated.find(f => f.id === newFile.id)?.status)
          return updated
        })
        
        toast({
          title: "File Ready",
          description: `${file.name} has been processed and is ready to upload.`,
        })
        
        console.log('File marked as completed:', file.name, 'Status should now be: completed')
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
      console.log('Starting document parsing for:', file.name, 'File ID:', fileId)
      
      // Add a small delay to show processing state
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const parsedDocument = await DocumentParser.parseDocument(file, user.id)
      console.log('Document parsing successful:', parsedDocument)
      
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
      
      // Generate asset name suggestions based on parsed content
      const suggestions = generateAssetNameSuggestions(parsedDocument, file.name)
      setSuggestedAssetNames(suggestions)
      
      // Show asset naming if we have good suggestions
      if (suggestions.length > 0 && !assetName) {
        setShowAssetNaming(true)
      }
      
      console.log('Document parsing completed successfully for:', file.name)
      
    } catch (error) {
      console.error('Document parsing error for file:', file.name, error)
      
      // Mark file as failed but still allow manual submission
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'completed', error: 'Parsing failed but file can still be uploaded' }
          : f
      ))
      
      toast({
        title: "Parsing Warning",
        description: "Document parsing failed, but you can still upload the file manually",
        variant: "destructive",
      })
    } finally {
      setIsParsing(false)
    }
  }

  const generateAssetNameSuggestions = (parsedDocument: ParsedDocument, filename: string): string[] => {
    const suggestions: string[] = []
    
    // Extract address information from real estate documents
    if (parsedDocument.extractedData.realEstate?.propertyAddress) {
      suggestions.push(parsedDocument.extractedData.realEstate.propertyAddress)
    }
    
    // Extract business names from business documents
    if (parsedDocument.extractedData.business?.businessName) {
      suggestions.push(parsedDocument.extractedData.business.businessName)
    }
    
    // Extract policy numbers from insurance documents
    if (parsedDocument.extractedData.insurance?.policyNumber) {
      suggestions.push(`Policy ${parsedDocument.extractedData.insurance.policyNumber}`)
    }
    
    // Extract vehicle information from filename patterns
    if (filename.toLowerCase().includes('vehicle') || filename.toLowerCase().includes('car')) {
      const vehicleMatch = filename.match(/(\d{4})\s*([A-Za-z]+)/)
      if (vehicleMatch) {
        suggestions.push(`${vehicleMatch[2]} ${vehicleMatch[1]}`)
      }
    }
    
    // Fallback: try to extract from filename
    const filenameParts = filename.replace(/[._-]/g, ' ').split(' ')
    const potentialAddress = filenameParts.filter(part => 
      part.length > 2 && /^[A-Za-z0-9]+$/.test(part)
    ).slice(0, 3).join(' ')
    
    if (potentialAddress.length > 5) {
      suggestions.push(potentialAddress)
    }
    
    return suggestions.slice(0, 3) // Limit to 3 suggestions
  }

  const validateVaultName = (name: string): { valid: boolean; error?: string } => {
    if (!name.trim()) {
      return { valid: false, error: 'Vault name is required' }
    }
    
    if (name.length < 3) {
      return { valid: false, error: 'Vault name must be at least 3 characters' }
    }
    
    if (name.length > 100) {
      return { valid: false, error: 'Vault name must be less than 100 characters' }
    }
    
    // Check for common naming patterns
    const hasNumbers = /\d/.test(name)
    const hasLetters = /[A-Za-z]/.test(name)
    
    if (!hasNumbers && !hasLetters) {
      return { valid: false, error: 'Vault name must contain letters or numbers' }
    }
    
    return { valid: true }
  }

  const addCustomCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a category name.",
        variant: "destructive",
      })
      return
    }

    // Check if category already exists
    const allCategories = [...categories, ...customCategories]
    const exists = allCategories.some(cat => 
      cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    )

    if (exists) {
      toast({
        title: "Category exists",
        description: "A category with this name already exists.",
        variant: "destructive",
      })
      return
    }

    const subcategories = newSubcategories
      .split(',')
      .map(sub => sub.trim())
      .filter(sub => sub.length > 0)

    const newCategory = {
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      subcategories: subcategories.length > 0 ? subcategories : ['General']
    }

    setCustomCategories(prev => [...prev, newCategory])
    setNewCategoryName('')
    setNewSubcategories('')
    setShowCustomCategoryForm(false)

    toast({
      title: "Category added",
      description: `"${newCategory.name}" category has been created successfully.`,
    })
  }

  const removeCustomCategory = (categoryId: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId))
    toast({
      title: "Category removed",
      description: "Custom category has been removed.",
    })
  }

  // Combine built-in and custom categories
  const allCategories = [...categories, ...customCategories]

  const startEditing = (fileId: string) => {
    setEditingFile(fileId)
  }

  const saveEditing = (_fileId: string) => {
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
      case 'saved': return <CheckCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'processing': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-300 font-semibold'
      case 'error': return 'bg-red-100 text-red-800 border-red-300'
      case 'saved': return 'bg-blue-100 text-blue-800 border-blue-300 font-semibold'
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
            Create Asset Vault & Add Documents
          </h1>
          <p className="text-slate-600">
            Create organized vaults for your assets and securely store all related documents
          </p>
        </div>

        {/* Asset Vault Creation Section - Show First */}
        {showAssetNaming && (
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-900">
                <Tag className="h-5 w-5" />
                <span>Step 1: Create Your Asset Vault</span>
              </CardTitle>
              <CardDescription className="text-blue-700">
                Start by creating a vault for your asset. This vault will organize all related documents automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-blue-900">Vault Name</Label>
                <Input
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g., 281 Loraine Road - Memphis Property, Tesla Model 3, John's 401k Portfolio"
                  className="h-10 text-sm border-blue-300"
                />
                <p className="text-xs text-blue-600 mt-1">
                  This creates a vault to organize all related documents. Think of it as a digital folder for your asset.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-blue-900">Category</Label>
                  <Select value={assetCategory} onValueChange={setAssetCategory}>
                    <SelectTrigger className="h-10 text-sm border-blue-300">
                      <SelectValue placeholder="Select category" />
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
                  <Label className="text-sm font-medium text-blue-900">Subcategory</Label>
                  <Select 
                    value={assetSubcategory} 
                    onValueChange={setAssetSubcategory}
                    disabled={!assetCategory}
                  >
                    <SelectTrigger className="h-10 text-sm border-blue-300">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetCategory && categories.find(c => c.id === assetCategory)?.subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {suggestedAssetNames.length > 0 && (
                <div>
                  <Label className="text-xs font-medium text-blue-700">Suggested Names:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {suggestedAssetNames.map((suggestion, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => setAssetName(suggestion)}
                        className="h-7 text-xs px-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                                  <Button
                    onClick={() => {
                      if (validateVaultName(assetName).valid && assetCategory && assetSubcategory) {
                        setShowAssetNaming(false)
                        toast({
                          title: "Asset vault created",
                          description: `"${assetName}" vault is ready for your documents.`,
                        })
                      } else {
                        toast({
                          title: "Missing information",
                          description: "Please provide vault name, category, and subcategory.",
                          variant: "destructive",
                        })
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Vault & Add Documents
                  </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowAssetNaming(false)}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  Skip for Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Upload Section - Only show after asset is named */}
        {!showAssetNaming && assetName && (
          <Card className="mb-6 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-900">
                <FileText className="h-5 w-5" />
                <span>Step 2: Add Paperwork to "{assetName}"</span>
              </CardTitle>
              <CardDescription className="text-green-700">
                Now add documents that belong to this asset vault. All documents will automatically be organized under "{assetName}" in the {categories.find(c => c.id === assetCategory)?.name} {'>'}{' '}{assetSubcategory} category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-green-100 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Asset Vault:</strong> {assetName} 
                  <br />
                  <strong>Category:</strong> {categories.find(c => c.id === assetCategory)?.name} {'>'}{' '}{assetSubcategory}
                </div>
              </div>
              <Button
                onClick={() => setShowAssetNaming(true)}
                variant="outline"
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                ← Change Asset Name
              </Button>
            </CardContent>
          </Card>
        )}

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



                      {/* Document Naming Section */}
                      {assetName && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700">Name This Document</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs text-green-700">Document Name</Label>
                              <Input
                                value={file.name}
                                onChange={(e) => updateFileMetadata(file.id, 'name', e.target.value)}
                                placeholder="e.g., Property Tax Bill 2025, Insurance Policy, Deed"
                                className="h-8 text-xs"
                              />
                            </div>
                            
                            <div className="text-xs text-green-600">
                              This document will be organized under: <strong>{assetName}</strong>
                            </div>
                          </div>
                        </div>
                      )}

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
                            {allCategories.map((category) => (
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

                      {/* Asset Organization Info */}
                      {assetName && (
                        <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-600">
                              <span className="font-medium">Asset:</span> {assetName}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // TODO: Navigate to asset view or show asset documents
                                toast({
                                  title: "Asset Management",
                                  description: `View all documents for ${assetName}`,
                                })
                              }}
                              className="h-6 text-xs px-2"
                            >
                              View Asset
                            </Button>
                          </div>
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
                
                {/* Submit Button */}
                {uploadedFiles.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        {uploadedFiles.filter(f => f.status === 'completed').length} of {uploadedFiles.length} files ready
                      </div>
                      <Button
                        onClick={handleSubmitAll}
                        disabled={uploadedFiles.some(f => f.status !== 'completed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg font-semibold"
                        size="lg"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Submit All Files
                      </Button>
                    </div>
                    
                    {/* Status Messages */}
                    {uploadedFiles.some(f => f.status !== 'completed') && (
                      <div className="text-xs text-slate-500 mt-2">
                        Waiting for all files to complete processing...
                      </div>
                    )}
                    
                    {uploadedFiles.every(f => f.status === 'completed') && (
                      <div className="text-sm text-green-600 mt-2 font-medium">
                        ✨ All files are ready! Click "Submit All Files" to save to your vault.
                      </div>
                    )}
                    
                    {/* Debug Info */}
                    <div className="text-xs text-slate-400 mt-2">
                      Debug: {uploadedFiles.map(f => `${f.name}: ${f.status}`).join(', ')}
                    </div>
                  </div>
                )}
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

                {/* Custom Categories */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Custom Categories</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCustomCategoryForm(!showCustomCategoryForm)}
                    >
                      {showCustomCategoryForm ? 'Cancel' : 'Add Category'}
                    </Button>
                  </div>

                  {showCustomCategoryForm && (
                    <div className="space-y-3 p-3 bg-slate-50 rounded border">
                      <div>
                        <Label className="text-xs font-medium">Category Name</Label>
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Hobbies, Collections, Travel"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Subcategories (comma-separated)</Label>
                        <Input
                          value={newSubcategories}
                          onChange={(e) => setNewSubcategories(e.target.value)}
                          placeholder="e.g., Photography, Gardening, Cooking"
                          className="h-8 text-sm"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={addCustomCategory}
                        className="w-full"
                      >
                        Create Category
                      </Button>
                    </div>
                  )}

                  {/* Display Custom Categories */}
                  {customCategories.length > 0 && (
                    <div className="space-y-2">
                      {customCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-2 bg-slate-100 rounded">
                          <div>
                            <div className="text-sm font-medium">{category.name}</div>
                            <div className="text-xs text-slate-600">
                              {category.subcategories.join(', ')}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCustomCategory(category.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
