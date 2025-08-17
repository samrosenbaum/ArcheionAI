"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { useMockAuth } from "@/lib/auth-context"
import { 
  Home,
  Shield,
  TrendingUp,
  GraduationCap,
  Coins,
  Briefcase,
  Users,
  Car,
  Building,
  ArrowRight,
  ArrowLeft,
  Plus,
  Upload
} from "lucide-react"

interface AssetCategory {
  id: string
  name: string
  description: string
  icon: any
  color: string
  subcategories: string[]
  examples: string[]
}

const assetCategories: AssetCategory[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Homes, investment properties, land, and commercial real estate",
    icon: Home,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Primary Home", "Investment Property", "Vacation Home", "Commercial Property", "Land"],
    examples: ["Property deeds", "Mortgage documents", "Rental agreements", "Property tax records"]
  },
  {
    id: "insurance",
    name: "Insurance",
    description: "All types of insurance policies and coverage documents",
    icon: Shield,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Auto Insurance", "Home Insurance", "Life Insurance", "Health Insurance", "Umbrella Policy"],
    examples: ["Insurance policies", "Claim documents", "Premium statements", "Coverage certificates"]
  },
  {
    id: "investments",
    name: "Investments",
    description: "Stocks, bonds, retirement accounts, and investment portfolios",
    icon: TrendingUp,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Stocks & Bonds", "Mutual Funds", "ETFs", "401k/IRA", "Alternative Investments"],
    examples: ["Account statements", "Trade confirmations", "Portfolio reports", "Tax documents"]
  },
  {
    id: "career",
    name: "Career & Licenses",
    description: "Professional licenses, certifications, and continuing education",
    icon: GraduationCap,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Professional Licenses", "Certifications", "Continuing Education", "Training Records"],
    examples: ["License documents", "CE certificates", "Training records", "Performance reviews"]
  },
  {
    id: "vehicles",
    name: "Vehicles",
    description: "Cars, boats, motorcycles, aircraft, and recreational vehicles",
    icon: Car,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Cars", "Motorcycles", "Boats", "Aircraft", "Recreational Vehicles"],
    examples: ["Vehicle titles", "Registration documents", "Insurance policies", "Maintenance records"]
  },
  {
    id: "business",
    name: "Business & LLCs",
    description: "Business formation, operating agreements, and corporate documents",
    icon: Briefcase,
    color: "from-slate-500 to-slate-600",
    subcategories: ["LLC Documents", "Operating Agreements", "Tax Filings", "Contracts", "Financial Statements"],
    examples: ["Articles of incorporation", "Operating agreements", "Tax returns", "Financial statements"]
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    description: "Digital assets, tokens, and blockchain investments",
    icon: Coins,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Bitcoin", "Ethereum", "Altcoins", "NFTs", "DeFi Protocols"],
    examples: ["Wallet addresses", "Transaction records", "Exchange statements", "Staking records"]
  },
  {
    id: "family",
    name: "Family Documents",
    description: "Personal and family records, identification, and legal documents",
    icon: Users,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Birth Certificates", "Social Security Cards", "Passports", "Marriage License", "Medical Records"],
    examples: ["Birth certificates", "Passports", "Medical records", "Family photos"]
  },
  {
    id: "trusts",
    name: "Trusts & Estates",
    description: "Estate planning, wills, trusts, and inheritance documents",
    icon: Building,
    color: "from-slate-500 to-slate-600",
    subcategories: ["Trust Agreements", "Wills", "Power of Attorney", "Healthcare Directives", "Estate Planning"],
    examples: ["Trust documents", "Wills", "Power of attorney", "Healthcare directives"]
  }
]

export default function AddAssetPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")
  const router = useRouter()
  const { user: _user } = useMockAuth()

  const handleCategorySelect = (category: AssetCategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory("")
  }

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }

  const handleContinue = () => {
    if (selectedCategory && selectedSubcategory) {
      // Navigate to the appropriate page or upload flow
      if (selectedCategory.id === "career") {
        router.push("/career")
      } else if (selectedCategory.id === "documents") {
        router.push("/upload")
      } else {
        router.push(`/${selectedCategory.id}`)
      }
    }
  }

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory("")
    } else if (selectedCategory) {
      setSelectedCategory(null)
    } else {
      router.push("/dashboard")
    }
  }

  const getStepTitle = () => {
    if (selectedSubcategory) {
      return `Add ${selectedSubcategory}`
    } else if (selectedCategory) {
      return `Select ${selectedCategory.name} Type`
    } else {
      return "What would you like to add?"
    }
  }

  const getStepDescription = () => {
    if (selectedSubcategory) {
      return `Let's add your ${selectedSubcategory.toLowerCase()} to your vault`
    } else if (selectedCategory) {
      return `Choose the specific type of ${selectedCategory.name.toLowerCase()} you want to add`
    } else {
      return "Select a category to get started adding assets to your digital vault"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {getStepTitle()}
              </h1>
              <p className="text-slate-600">
                {getStepDescription()}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${!selectedCategory ? 'bg-slate-900' : 'bg-slate-300'}`} />
            <div className={`w-3 h-3 rounded-full ${selectedCategory && !selectedSubcategory ? 'bg-slate-900' : 'bg-slate-300'}`} />
            <div className={`w-3 h-3 rounded-full ${selectedCategory && selectedSubcategory ? 'bg-slate-900' : 'bg-slate-300'}`} />
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assetCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card 
                  key={category.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {category.description}
                      </p>
                      <div className="text-xs text-slate-500">
                        Examples: {category.examples.slice(0, 2).join(", ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Step 2: Subcategory Selection */}
        {selectedCategory && !selectedSubcategory && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <selectedCategory.icon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedCategory.name}
              </h2>
              <p className="text-slate-600">
                What type of {selectedCategory.name.toLowerCase()} would you like to add?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory.subcategories.map((subcategory) => (
                <Card 
                  key={subcategory}
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => handleSubcategorySelect(subcategory)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {subcategory}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Add {subcategory.toLowerCase()} to your vault
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Action Selection */}
        {selectedCategory && selectedSubcategory && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <selectedCategory.icon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedSubcategory}
              </h2>
              <p className="text-slate-600">
                How would you like to add your {selectedSubcategory.toLowerCase()}?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Upload Documents
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Upload existing documents related to your {selectedSubcategory.toLowerCase()}
                  </p>
                  <Button 
                    onClick={() => router.push("/upload")}
                    className="w-full"
                  >
                    Upload Documents
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Manual Entry
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Manually enter details about your {selectedSubcategory.toLowerCase()}
                  </p>
                  <Button 
                    variant="outline"
                    onClick={handleContinue}
                    className="w-full"
                  >
                    Enter Manually
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {selectedCategory && selectedSubcategory && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleContinue}
              size="lg"
              className="bg-slate-900 hover:bg-slate-800"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
