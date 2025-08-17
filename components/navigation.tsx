"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { 
  Home,
  BarChart3,
  FileText,
  Shield,
  TrendingUp,
  Coins,
  Briefcase,
  Users,
  GraduationCap,
  Bell,
  Menu,
  X,
  ChevronDown,
  Upload,
  Plus,
  Search,
  MessageSquare,
  Camera
} from "lucide-react"

interface NavigationProps {
  showMobileMenu?: boolean
  onMobileMenuToggle?: () => void
}

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Assets", href: "/assets", icon: BarChart3 },
  { name: "Add Asset", href: "/add-asset", icon: Plus, variant: "default" as const },
]

const quickActions = [
  { name: "Upload Document", href: "/upload", icon: Upload },
]

export function Navigation({ showMobileMenu, onMobileMenuToggle }: NavigationProps) {
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        {mainNavItems.map((item) => {
          const IconComponent = item.icon
          const isAddAsset = item.name === "Add Asset"
          
          if (isAddAsset) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          }
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenuToggle}
      >
        {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm text-slate-900 font-medium">Insurance Policy Expiring</p>
                  <p className="text-xs text-slate-600">Your auto insurance expires in 30 days</p>
                  <span className="text-xs text-blue-600">2 hours ago</span>
                </div>
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm text-slate-900 font-medium">New Document Processed</p>
                  <p className="text-xs text-slate-600">Tax return has been analyzed</p>
                  <span className="text-xs text-blue-600">1 day ago</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-900 font-medium">Portfolio Update</p>
                  <p className="text-xs text-slate-600">Investment portfolio rebalancing recommended</p>
                  <span className="text-xs text-blue-600">3 days ago</span>
                </div>
              </div>
              <div className="p-4 border-t border-slate-200">
                <Button variant="outline" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
            <span className="hidden sm:block text-sm font-medium">John Doe</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
              <div className="p-4 border-b border-slate-200">
                <p className="text-sm font-medium text-slate-900">John Doe</p>
                <p className="text-xs text-slate-600">john.doe@example.com</p>
              </div>
              <div className="p-2">
                <Link href="/profile" className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Profile Settings
                </Link>
                <Link href="/family" className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Family Management
                </Link>
                <Link href="/security" className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Security & Privacy
                </Link>
                <Link href="/billing" className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Billing & Plans
                </Link>
                <Link href="/help" className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Help & Support
                </Link>
              </div>
              <div className="p-2 border-t border-slate-200">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onMobileMenuToggle} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <Logo size="md" />
              <Button variant="ghost" size="icon" onClick={onMobileMenuToggle}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Main Navigation */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Navigation</h3>
                <div className="space-y-2">
                  {mainNavItems.map((item) => {
                    const IconComponent = item.icon
                    const isAddAsset = item.name === "Add Asset"
                    
                    if (isAddAsset) {
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onMobileMenuToggle}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    }
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onMobileMenuToggle}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-slate-100 text-slate-900"
                            : "text-slate-900 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon
                    return (
                      <Link
                        key={action.name}
                        href={action.href}
                        onClick={onMobileMenuToggle}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{action.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* User Section */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">John Doe</p>
                    <p className="text-xs text-slate-600">Premium Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
