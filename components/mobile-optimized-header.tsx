"use client"

import { useState } from "react"
import { Bell, Search, Menu, Camera, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhotoCapture } from "./photo-capture"

interface MobileHeaderProps {
  onMenuToggle?: () => void
}

export function MobileOptimizedHeader({ onMenuToggle }: MobileHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl">
      {/* Main Header */}
      <div className="flex h-16 items-center gap-3 px-4">
        <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-lg" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden border-t border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 px-4 py-3">
          <PhotoCapture />

          <Button variant="outline" size="sm" className="bg-transparent flex-1 max-w-48">
            <MessageSquare className="h-4 w-4 mr-2" />
            Text (555) 123-DOCS
          </Button>
        </div>

        <div className="px-4 pb-3">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
            <div className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4 text-indigo-600" />
              <span className="text-indigo-900 font-medium">Snap & Text like Ramp!</span>
            </div>
            <p className="text-xs text-indigo-700 mt-1">Just text photos to auto-categorize documents 📸</p>
          </div>
        </div>
      </div>
    </header>
  )
}
