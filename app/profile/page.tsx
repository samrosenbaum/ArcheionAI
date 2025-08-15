"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { 
  User,
  Mail,
  Shield,
  Bell,
  CreditCard,
  Users,
  Edit,
  Save,
  X,
  Camera,
  Key,
  Lock,
  Zap,
  Crown,
  MessageSquare
} from "lucide-react"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  dateOfBirth: string
  occupation: string
  company: string
  website: string
  bio: string
  preferences: {
    notifications: boolean
    marketing: boolean
    twoFactor: boolean
    privacy: 'public' | 'private' | 'family'
  }
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise'
    status: 'active' | 'expired' | 'cancelled'
    nextBilling: string
  }
}

export default function ProfilePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "1234 Beverly Hills Drive",
    city: "Beverly Hills",
    state: "CA",
    zipCode: "90210",
    dateOfBirth: "1985-06-15",
    occupation: "Entrepreneur",
    company: "Tech Ventures LLC",
    website: "https://johndoe.com",
    bio: "High-net-worth individual focused on technology investments and real estate development.",
    preferences: {
      notifications: true,
      marketing: false,
      twoFactor: true,
      privacy: 'family'
    },
    subscription: {
      plan: 'premium',
      status: 'active',
      nextBilling: '2024-02-15'
    }
  })

  const [formData, setFormData] = useState(profile)

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const updateFormData = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updatePreferences = (field: keyof UserProfile['preferences'], value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }))
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-slate-100 text-slate-800'
      case 'premium': return 'bg-blue-100 text-blue-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'basic': return <User className="h-4 w-4" />
      case 'premium': return <Crown className="h-4 w-4" />
      case 'enterprise': return <Zap className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "billing", name: "Billing", icon: CreditCard },
    { id: "family", name: "Family", icon: Users }
  ]

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
            Profile Settings
          </h1>
          <p className="text-slate-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-slate-100 text-slate-900"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        {tab.name}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {profile.firstName[0]}{profile.lastName[0]}
                        </span>
                      </div>
                      {isEditing && (
                        <Button
                          size="icon"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-slate-600">{profile.occupation}</p>
                      <Badge className={getPlanColor(profile.subscription.plan)}>
                        {getPlanIcon(profile.subscription.plan)}
                        <span className="ml-1 capitalize">{profile.subscription.plan}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) => updateFormData('occupation', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => updateFormData('company', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => updateFormData('zipCode', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-slate-600">Add an extra layer of security</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={profile.preferences.twoFactor ? "default" : "secondary"}>
                          {profile.preferences.twoFactor ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {profile.preferences.twoFactor ? "Manage" : "Enable"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Password</h4>
                          <p className="text-sm text-slate-600">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">API Keys</h4>
                          <p className="text-sm text-slate-600">Manage your API access</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage Keys
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Push Notifications</h4>
                          <p className="text-sm text-slate-600">Get notified about important updates</p>
                        </div>
                      </div>
                      <Button
                        variant={profile.preferences.notifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => updatePreferences('notifications', !profile.preferences.notifications)}
                      >
                        {profile.preferences.notifications ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Email Notifications</h4>
                          <p className="text-sm text-slate-600">Receive updates via email</p>
                        </div>
                      </div>
                      <Button
                        variant={profile.preferences.notifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => updatePreferences('notifications', !profile.preferences.notifications)}
                      >
                        {profile.preferences.notifications ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-orange-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">SMS Notifications</h4>
                          <p className="text-sm text-slate-600">Get urgent alerts via text</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-900">
                          {profile.subscription.plan.charAt(0).toUpperCase() + profile.subscription.plan.slice(1)} Plan
                        </h4>
                        <p className="text-blue-700">Next billing: {new Date(profile.subscription.nextBilling).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getPlanColor(profile.subscription.plan)}>
                        {getPlanIcon(profile.subscription.plan)}
                        <span className="ml-1 capitalize">{profile.subscription.plan}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Change Plan
                      </Button>
                      <Button variant="outline" size="sm">
                        View Billing History
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4 text-center">
                        <User className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <h4 className="font-medium text-slate-900">Basic</h4>
                        <p className="text-2xl font-bold text-slate-900">$29</p>
                        <p className="text-sm text-slate-600">per month</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm border-blue-200 bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <Crown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-blue-900">Premium</h4>
                        <p className="text-2xl font-bold text-blue-900">$99</p>
                        <p className="text-sm text-blue-600">per month</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4 text-center">
                        <Zap className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <h4 className="font-medium text-slate-900">Enterprise</h4>
                        <p className="text-2xl font-bold text-slate-900">$299</p>
                        <p className="text-sm text-slate-600">per month</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Family Tab */}
            {activeTab === "family" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Family Management</CardTitle>
                  <CardDescription>Manage family members and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Family Features Coming Soon</h3>
                    <p className="text-slate-600 mb-6">
                      Manage family accounts, permissions, and shared access to your vault
                    </p>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
