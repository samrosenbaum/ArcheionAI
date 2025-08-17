"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { 
  FileText, 
  Shield, 
  TrendingUp, 
  CreditCard, 
  Home, 
  Briefcase,
  ArrowRight,
  Upload,
  Camera,
  MessageSquare,
  Zap,
  BarChart3
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {

  const features = [
    {
      icon: Shield,
      title: "Digital Safe for Everything You Own",
      description: "All critical asset documents in one secure, searchable place — titles, deeds, insurance, tax filings, estate docs"
    },
    {
      icon: TrendingUp,
      title: "Automated Financial Radar",
      description: "Tracks what's changing and flags what needs attention, giving you proactive oversight of your assets"
    },
    {
      icon: BarChart3,
      title: "CFO-Style Visibility",
      description: "The proactive monitoring and optimization a CFO would bring to a company, applied to your personal assets"
    },
    {
      icon: Zap,
      title: "Intelligent Life Admin",
      description: "Simply upload documents and let AI organize, track deadlines, and alert you to opportunities or risks"
    }
  ]

  const categories = [
    { icon: FileText, name: "Tax & Estate", color: "bg-slate-700" },
    { icon: Shield, name: "Insurance", color: "bg-slate-700" },
    { icon: TrendingUp, name: "Investments", color: "bg-slate-700" },
    { icon: CreditCard, name: "Banking", color: "bg-slate-700" },
    { icon: Home, name: "Real Estate", color: "bg-slate-700" },
    { icon: Briefcase, name: "Business", color: "bg-slate-700" }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" />
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-slate-900 hover:bg-slate-800">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            CFO-Level Oversight for
            <span className="block text-slate-600"> Your Life Admin</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Archeion is your secure digital safe for everything you own — from car titles to property deeds, 
            insurance policies to tax records. We give you CFO-style oversight of your assets by tracking costs, 
            deadlines, and changes, then alerting you to opportunities to save money or avoid problems before they happen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="text-lg px-10 py-6 bg-slate-900 hover:bg-slate-800" asChild>
              <Link href="/login">
                Start Your Asset Oversight
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {/* Removed stats section as per edit hint */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Think of it as a CFO's Dashboard — For Your Home, Properties, and Assets
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional-grade oversight tools that give you the same visibility into your personal finances 
              that a CFO has into a company's operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-600">
            <strong>Important:</strong> Archeion is a digital safe and asset oversight platform. We do not provide financial, 
            investment, or tax advice. Our platform helps you organize, track, and monitor your assets and documents, 
            but all financial decisions should be made in consultation with licensed professionals. 
            For financial advice, please consult with qualified financial advisors, accountants, or attorneys.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Complete Asset Portfolio Coverage
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From liquid assets to real estate, organize and monitor everything you own in one secure platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                  <CardContent className="pt-8 pb-6">
                    <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Upload Methods Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Seamless Asset Integration
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Multiple ways to add documents and track your assets for complete oversight
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="pt-8 pb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Web Upload</h3>
                <p className="text-slate-600 mb-6 text-lg">Drag and drop or browse files directly from your computer</p>
                <Button variant="outline" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <Link href="/login">Try Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="pt-8 pb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Photo Capture</h3>
                <p className="text-slate-600 mb-6 text-lg">Take photos of documents with your mobile device</p>
                <Button variant="outline" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <Link href="/login">Try Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="pt-8 pb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">SMS Upload</h3>
                <p className="text-slate-600 mb-6 text-lg">Text photos to our secure number for instant processing</p>
                <Button variant="outline" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <Link href="/login">Try Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for CFO-Level Oversight of Your Assets?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Join individuals and families who trust Archeion to provide proactive oversight and intelligent monitoring of their assets
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 bg-white text-slate-900 hover:bg-slate-100" asChild>
              <Link href="/login">
                Start Your Asset Oversight
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-white text-white hover:bg-white hover:text-slate-900" asChild>
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <Logo size="lg" showIcon={false} />
              <p className="text-slate-400 mt-6 text-lg">
                A secure digital safe with CFO-level oversight for your personal assets and life admin.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Platform</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Plans</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Platform Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Archeion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
