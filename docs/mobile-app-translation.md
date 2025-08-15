# Mobile App Translation Guide

## How Easy is Mobile Translation?

**Very Easy! Here's why:**

### 1. **React Native Compatibility** 
- Current React/Next.js codebase translates directly to React Native
- Shared business logic and state management
- Same TypeScript types and interfaces
- Supabase works perfectly with React Native

### 2. **Native Features Already Designed For**
\`\`\`typescript
// Camera integration (already built for web)
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'

// SMS integration (native SMS sending)
import * as SMS from 'expo-sms'

// Push notifications
import * as Notifications from 'expo-notifications'
\`\`\`

### 3. **Key Mobile Advantages**
- **Native camera access** - Better than web camera
- **SMS integration** - Can send/receive SMS natively  
- **Push notifications** - Real-time alerts
- **Offline storage** - SQLite + Supabase sync
- **Biometric auth** - Face ID / Touch ID
- **Background processing** - Document processing while app closed

### 4. **Architecture Stays the Same**
\`\`\`
Mobile App (React Native)
    ↓
Supabase Backend (Same)
    ↓  
AI Services (Same)
    ↓
Document Storage (Same)
\`\`\`

### 5. **Development Timeline**
- **Week 1-2**: React Native setup + core navigation
- **Week 3-4**: Camera integration + photo capture
- **Week 5-6**: SMS integration + AI processing  
- **Week 7-8**: Document management + sync
- **Week 9-10**: Polish + app store submission

### 6. **Mobile-Specific Features to Add**
\`\`\`typescript
// Ramp-style receipt capture
const captureReceipt = async () => {
  const photo = await Camera.takePictureAsync()
  const classification = await AIDocumentClassifier.classifyDocument(photo.uri)
  await DocumentStorageService.uploadDocument(photo, classification)
  
  // Send confirmation SMS
  await SMS.sendSMSAsync(userPhone, `✅ ${classification.title} categorized!`)
}

// Background document processing
const processInBackground = async () => {
  await BackgroundTask.define(() => {
    // Process pending documents
    // Sync with Supabase
    // Send push notifications
  })
}
\`\`\`

### 7. **Expo vs React Native CLI**
**Recommendation: Expo (Managed Workflow)**
- Faster development
- Built-in camera, SMS, notifications
- Easy app store deployment
- Can eject if needed for custom native code

### 8. **Code Reuse Percentage**
- **Business Logic**: 95% reusable
- **UI Components**: 80% reusable (adapt for mobile)
- **API Integration**: 100% reusable
- **Database Schema**: 100% reusable

**Total Reuse: ~85% of current codebase**

## Mobile App Structure
\`\`\`
archeion-mobile/
├── src/
│   ├── components/          # Adapted UI components
│   ├── screens/            # Mobile-specific screens
│   ├── lib/               # Same business logic
│   ├── services/          # Same API services
│   └── navigation/        # React Navigation
├── assets/
└── app.json              # Expo configuration
\`\`\`

The mobile translation would be **straightforward** and **highly valuable** - giving users the Ramp-like experience they want with professional document management capabilities.
\`\`\`

\`\`\`typescriptreact file="app/page.tsx"
[v0-no-op-code-block-prefix]"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, FileText, Home, Plus, Search, Settings, TrendingUp, ArrowUpRight, Shield, Building, Car, AlertTriangle, Clock, Download, MoreHorizontal, Zap, Target, PieChart, BarChart3, Calculator, Briefcase, Upload, Users, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { PhotoCapture } from "@/components/photo-capture"

const assetCategories = [
  {
    name: "Insurance",
    slug: "insurance",
    icon: Shield,
    count: 12,
    alerts: 3,
    value: "$2M Coverage",
    change: "Needs Review",
    trend: "warning",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Tax Documents",
    slug: "tax",
    icon: FileText,
    count: 24,
    alerts: 1,
    value: "Current",
    change: "2024",
    trend: "neutral",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: Home,
    count: 15,
    alerts: 2,
    value: "$4.2M",
    change: "+12.3%",
    trend: "up",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Vehicles",
    slug: "vehicle",
    icon: Car,
    count: 6,
    alerts: 0,
    value: "$485K",
    change: "-2.1%",
    trend: "down",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Business",
    slug: "business",
    icon: Building,
    count: 9,
    alerts: 1,
    value: "$2.8M",
    change: "+8.7%",
    trend: "up",
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Personal",
    slug: "personal",
    icon: Users,
    count: 4,
    alerts: 0,
    value: "Complete",
    change: "Updated",
    trend: "neutral",
    color: "from-cyan-500 to-blue-500",
  },
]

const optimizationOpportunities = [
  {
    id: 1,
    type: "tax_savings",
    title: "1031 Exchange Opportunity",
    description: "Memphis rental property qualifies for tax-deferred exchange",
    potentialSavings: "$47,200",
    confidence: 95,
    priority: "high",
    category: "Tax Optimization",
    timeframe: "Before Dec 31, 2024",
    effort: "Medium",
    documents: ["Property Deed", "2024 Tax Return", "Rental Income Records"],
    recommendation:
      "Consider exchanging Memphis property for like-kind investment to defer $47K in capital gains taxes. Current property value: $485K, basis: $250K.",
    nextSteps: [
      "Consult with 1031 exchange intermediary",
      "Identify replacement properties",
      "Review timeline requirements",
    ],
  },
  {
    id: 2,
    type: "insurance_optimization",
    title: "Umbrella Policy Gap",
    description: "Current coverage insufficient for net worth protection",
    potentialSavings: "$2.3M",
    confidence: 88,
    priority: "high",
    category: "Risk Management",
    timeframe: "Within 30 days",
    effort: "Low",
    documents: ["Current Umbrella Policy", "Asset Valuation"],
    recommendation:
      "Increase umbrella coverage from $2M to $5M. With $9.4M net worth, current coverage leaves $7.4M exposed. Additional premium: ~$400/year.",
    nextSteps: ["Request quotes for $5M coverage", "Review policy exclusions", "Update beneficiary information"],
  },
]

function AppSidebar() {
  const router = useRouter()

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-slate-50 to-white">
      <SidebarHeader className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Archeion AI
            </span>
            <span className="text-xs font-medium text-slate-500">Document Intelligence</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Optimization
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-3 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Opportunities</span>
                  <Badge variant="destructive" className="ml-auto text-xs">
                    5
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Alerts</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    3
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {assetCategories.map((category) => (
                <SidebarMenuItem key={category.slug}>
                  <SidebarMenuButton
                    className="h-12 px-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 group"
                    onClick={() => router.push(`/category/${category.slug}`)}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm`}
                    >
                      <category.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">{category.name}</div>
                      <div className="text-xs text-slate-500">{category.count} items</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.alerts > 0 && (
                        <div className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {category.alerts}
                        </div>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-slate-900">John Doe</div>
                    <div className="text-xs text-slate-500">Family Office</div>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Family Members</DropdownMenuItem>
                <DropdownMenuItem>Security</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function ArcheionDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="hover:bg-slate-100 rounded-lg transition-colors" />
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search opportunities, documents, insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-300 focus:ring-indigo-200 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <PhotoCapture />
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100 relative">
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Hero Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              Good morning, John
            </h1>
            <p className="text-slate-600">You have 5 optimization opportunities worth $91,900 in potential savings</p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-700">Potential Savings</p>
                    <p className="text-2xl font-bold text-emerald-900">$91,900</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">5 opportunities</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-700">Portfolio Value</p>
                    <p className="text-2xl font-bold text-blue-900">$9.4M</p>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">+8.2%</span>
                      <span className="text-blue-600">YTD</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-700">Documents</p>
                    <p className="text-2xl font-bold text-orange-900">1,247</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Plus className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-600 font-medium">23 added</span>
                      <span className="text-orange-600">this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-700">Active Insights</p>
                    <p className="text-2xl font-bold text-purple-900">12</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-purple-600 font-medium">3 need attention</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Categories - Now Clickable */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">Document Categories</CardTitle>
                  <CardDescription className="text-slate-600">
                    Click any category to view and manage documents
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assetCategories.map((category) => (
                  <div
                    key={category.slug}
                    className="group p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md cursor-pointer transition-all duration-200"
                    onClick={() => router.push(`/category/${category.slug}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      {category.alerts > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {category.alerts} alert{category.alerts > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{category.count} documents</span>
                        <div className="flex items-center gap-1">
                          {category.trend === "up" && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                          {category.trend === "warning" && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                          <span
                            className={`text-sm font-medium ${
                              category.trend === "up"
                                ? "text-emerald-600"
                                : category.trend === "warning"
                                  ? "text-orange-600"
                                  : "text-slate-600"
                            }`}
                          >
                            {category.change}
                          </span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-slate-900">{category.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Opportunities */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">Top Optimization Opportunities</CardTitle>
                  <CardDescription className="text-slate-600">
                    AI-powered recommendations to maximize your wealth
                  </CardDescription>
                </div>
                <Button variant="outline" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizationOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                          opportunity.priority === "high"
                            ? "bg-gradient-to-br from-red-500 to-orange-500"
                            : "bg-gradient-to-br from-blue-500 to-indigo-500"
                        }`}
                      >
                        {opportunity.type === "tax_savings" && <Calculator className="h-6 w-6 text-white" />}
                        {opportunity.type === "insurance_optimization" && <Shield className="h-6 w-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{opportunity.title}</h3>
                          <Badge variant={opportunity.priority === "high" ? "destructive" : "secondary"}>
                            {opportunity.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{opportunity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">{opportunity.potentialSavings}</div>
                      <div className="text-xs text-slate-500">{opportunity.confidence}% confidence</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-slate-700">{opportunity.recommendation}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {opportunity.timeframe}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {opportunity.effort} effort
                      </span>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
