"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { useMockAuth } from "@/lib/auth-context"
import { 
  Building
} from "lucide-react"

export default function BusinessPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { user: _user } = useMockAuth()

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
            Business & LLCs
          </h1>
          <p className="text-slate-600">
            Manage your business documents and corporate assets
          </p>
        </div>

        <div className="text-center py-12">
          <Building className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-slate-600 mb-6">
            Business management features will be available soon.
          </p>
          <Button variant="outline">
            Get Notified
          </Button>
        </div>
      </div>
    </div>
  )
}
