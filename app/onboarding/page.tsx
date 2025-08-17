"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Logo } from "@/components/logo"
import { FileUploadService, UploadedFile } from "@/lib/file-upload-service"
import { useMockAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { 
  Shield, Upload, Brain, Target, CheckCircle, ArrowRight, FileText, Home, Car, CreditCard, Briefcase
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useMockAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onboardingSteps = [
    { step: 1, title: "Welcome to Archeion", description: "Let's get you set up" },
    { step: 2, title: "What do you own?", description: "Select your asset types" },
    { step: 3, title: "Upload your first document", description: "See the magic happen" },
    { step: 4, title: "AI Analysis Overview", description: "Understanding your insights" },
    { step: 5, title: "You're all set!", description: "Welcome to your digital vault" }
  ]

  const assetCategories = [
    { id: "real-estate", name: "Real Estate", icon: Home, description: "Homes, investment properties, land" },
    { id: "vehicles", name: "Vehicles", icon: Car, description: "Cars, boats, motorcycles, aircraft" },
    { id: "investments", name: "Investments", icon: CreditCard, description: "Stocks, bonds, retirement accounts" },
    { id: "business", name: "Business & LLCs", icon: Briefcase, description: "Business documents and assets" },
    { id: "insurance", name: "Insurance", icon: Shield, description: "Policies and coverage documents" },
    { id: "crypto", name: "Cryptocurrency", icon: CreditCard, description: "Digital assets and tokens" },
    { id: "family", name: "Family Documents", icon: Shield, description: "Personal and family records" },
    { id: "trusts", name: "Trusts & Estates", icon: Shield, description: "Estate planning documents" }
  ]

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    )
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      try {
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
        
        setUploadedFile(newFile)
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + Math.random() * 20
          })
        }, 200)
        
        // Upload file using the service
        const uploadedFile = await FileUploadService.uploadFile(file, user.id, {
          category: 'uncategorized'
        })
        
        clearInterval(progressInterval)
        setUploadProgress(100)
        
        // Update the file with the uploaded data
        setUploadedFile(uploadedFile)
        
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully.`,
        })
        
        // Move to next step after a short delay
        setTimeout(() => {
          handleNext()
        }, 1500)
        
      } catch (error) {
        console.error('Upload error:', error)
        setUploadProgress(0)
        
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : 'Failed to upload file',
          variant: "destructive",
        })
      } finally {
        // setIsUploading(false) // This line was removed
      }
    }
  }

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Welcome to Your Digital Vault
              </h2>
              <p className="text-lg text-slate-600">
                Archeion gives you CFO-level oversight of your personal assets. 
                Let's set up your secure digital safe in just a few minutes.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-8 w-8 text-slate-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Secure Storage</h3>
                      <p className="text-sm text-slate-600">Bank-level encryption for all your documents</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Brain className="h-8 w-8 text-slate-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">AI Analysis</h3>
                      <p className="text-sm text-slate-600">Automatic insights and optimization tips</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target className="h-8 w-8 text-slate-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Smart Tracking</h3>
                      <p className="text-sm text-slate-600">Never miss important deadlines again</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What do you own?
              </h2>
              <p className="text-lg text-slate-600">
                Select the types of assets you want to track and manage. 
                You can always add more later.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {assetCategories.map((asset) => {
                  const IconComponent = asset.icon
                  const isSelected = selectedAssets.includes(asset.id)
                  return (
                    <Card 
                      key={asset.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-slate-900 bg-slate-50' 
                          : 'hover:shadow-md hover:bg-slate-50'
                      }`}
                      onClick={() => handleAssetToggle(asset.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                          isSelected ? 'bg-slate-900' : 'bg-slate-200'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            isSelected ? 'text-white' : 'text-slate-600'
                          }`} />
                        </div>
                        <h3 className={`font-semibold mb-2 ${
                          isSelected ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {asset.name}
                        </h3>
                        <p className="text-xs text-slate-500">{asset.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Let's Upload Your First Document
              </h2>
              <p className="text-lg text-slate-600">
                Upload any important document to see how Archeion automatically 
                categorizes and analyzes it for you.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
                <CardContent className="p-12 text-center">
                  <Upload size={48} className="text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Or click to browse files (PDF, JPG, PNG)
                  </p>
                  <Button 
                    className="bg-slate-900 hover:bg-slate-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </CardContent>
              </Card>
              
              {uploadedFile && (
                <Card className="mt-6 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{uploadedFile.name}</p>
                        <p className="text-sm text-slate-500">
                          {uploadedFile.size > 0 ? formatFileSize(uploadedFile.size) : 'Processing...'}
                        </p>
                      </div>
                      <Badge className="bg-slate-100 text-slate-900 border-slate-300">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </CardContent>
                </Card>
              )}
              
              <div className="text-center mt-6">
                <p className="text-sm text-slate-500">
                  Don't have a document ready? You can skip this step and come back later.
                </p>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                See the Magic Happen
              </h2>
              <p className="text-lg text-slate-600">
                Watch how Archeion's AI automatically processes your documents 
                and provides actionable insights.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain size={20} className="text-slate-700" />
                      <span>AI Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-slate-700" />
                        <span>Automatic document categorization</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-slate-700" />
                        <span>Key information extraction</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-slate-700" />
                        <span>Deadline and renewal tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target size={20} className="text-slate-700" />
                      <span>Smart Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-slate-700" />
                        <span>Cost optimization opportunities</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-slate-700" />
                        <span>Risk assessment alerts</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-slate-700" />
                        <span>Portfolio performance tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Step {currentStep} of {onboardingSteps.length}
              </span>
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Progress value={uploadProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === onboardingSteps.length}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {currentStep === onboardingSteps.length ? (
                "Complete Setup"
              ) : (
                <>
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
