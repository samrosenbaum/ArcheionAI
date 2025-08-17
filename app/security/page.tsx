"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Globe,
  Settings,
  Download,
  Trash2,
  Plus
} from "lucide-react"

export default function SecurityPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const securitySettings = {
    twoFactorEnabled: true,
    biometricEnabled: true,
    sessionTimeout: 30,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    dataEncryption: true,
    auditLogging: true
  }

  const recentActivity = [
    {
      id: 1,
      action: "Login",
      location: "San Francisco, CA",
      device: "Chrome on MacBook Pro",
      time: "2 minutes ago",
      status: "success",
      ip: "192.168.1.100"
    },
    {
      id: 2,
      action: "Document Upload",
      location: "San Francisco, CA",
      device: "Chrome on MacBook Pro",
      time: "1 hour ago",
      status: "success",
      ip: "192.168.1.100"
    },
    {
      id: 3,
      action: "Login Attempt",
      location: "New York, NY",
      device: "Unknown",
      time: "3 hours ago",
      status: "blocked",
      ip: "203.0.113.45"
    },
    {
      id: 4,
      action: "Password Change",
      location: "San Francisco, CA",
      device: "Chrome on MacBook Pro",
      time: "1 day ago",
      status: "success",
      ip: "192.168.1.100"
    }
  ]

  const securityScore = 92

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'blocked': return 'bg-slate-100 text-slate-800 border-slate-300'
      case 'warning': return 'bg-slate-50 text-slate-700 border-slate-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-slate-700" />
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-slate-700" />
      case 'warning': return <Clock className="h-4 w-4 text-slate-700" />
      default: return <CheckCircle className="h-4 w-4 text-slate-700" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Security & Privacy</h1>
          <p className="text-slate-600">Manage your account security settings and monitor activity</p>
        </div>

        {/* Security Score */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Security Score</h2>
                <p className="text-slate-600">Your account security rating</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">{securityScore}/100</div>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-600 rounded-full transition-all duration-300"
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-600 mt-2">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-slate-700" />
                <span>Account Security</span>
              </CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-slate-900">Two-Factor Authentication</Label>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
                <Switch checked={securitySettings.twoFactorEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-slate-900">Biometric Login</Label>
                  <p className="text-xs text-slate-500">Use fingerprint or face ID</p>
                </div>
                <Switch checked={securitySettings.biometricEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-slate-900">Login Notifications</Label>
                  <p className="text-xs text-slate-500">Get notified of new logins</p>
                </div>
                <Switch checked={securitySettings.loginNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-slate-900">Suspicious Activity Alerts</Label>
                  <p className="text-xs text-slate-500">Alert on unusual activity</p>
                </div>
                <Switch checked={securitySettings.suspiciousActivityAlerts} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-slate-700" />
                <span>Privacy Settings</span>
              </CardTitle>
              <CardDescription>Control your data and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-slate-900">Data Encryption</Label>
                  <p className="text-xs text-slate-500">256-bit AES encryption</p>
                </div>
                <Switch checked={securitySettings.dataEncryption} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-slate-900">Audit Logging</Label>
                  <p className="text-xs text-slate-500">Track all account activity</p>
                </div>
                <Switch checked={securitySettings.auditLogging} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-900">Session Timeout</Label>
                <Select defaultValue={securitySettings.sessionTimeout.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Change */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-slate-700" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Button className="bg-slate-900 hover:bg-slate-800">
                  Update Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-slate-700" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Monitor your account activity and login attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{activity.action}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{activity.ip}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{activity.device}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                    <p className="text-sm text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="border-slate-300">
            <Download className="h-4 w-4 mr-2" />
            Export Security Log
          </Button>
          <Button variant="outline" className="border-slate-300">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </main>
    </div>
  )
}
