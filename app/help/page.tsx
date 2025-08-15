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
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  BookOpen,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  Users,
  CreditCard,
  Settings,
  X
} from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export default function HelpPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  })

  const categories = [
    { id: "all", name: "All Topics", icon: HelpCircle },
    { id: "getting-started", name: "Getting Started", icon: Zap },
    { id: "security", name: "Security & Privacy", icon: Shield },
    { id: "documents", name: "Document Management", icon: FileText },
    { id: "assets", name: "Asset Management", icon: CreditCard },
    { id: "billing", name: "Billing & Plans", icon: CreditCard },
    { id: "technical", name: "Technical Issues", icon: Settings }
  ]

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I get started with Archeion?",
      answer: "Getting started is easy! Simply create an account, complete the onboarding process, and start uploading your first documents. Our guided setup will help you organize your assets and documents efficiently.",
      category: "getting-started",
      tags: ["onboarding", "setup", "first-time"]
    },
    {
      id: "2",
      question: "What types of documents can I upload?",
      answer: "Archeion supports a wide range of document types including PDFs, images (JPG, PNG), Word documents, and text files. We recommend using PDFs for the best compatibility and security.",
      category: "documents",
      tags: ["upload", "file-types", "compatibility"]
    },
    {
      id: "3",
      question: "How secure is my data?",
      answer: "Your data security is our top priority. We use bank-level encryption, secure cloud storage, and strict access controls. All data is encrypted both in transit and at rest, and we never share your information with third parties.",
      category: "security",
      tags: ["security", "encryption", "privacy"]
    },
    {
      id: "4",
      question: "Can I share documents with family members?",
      answer: "Yes! Our family management features allow you to securely share documents and assets with family members while maintaining full control over permissions and access levels.",
      category: "documents",
      tags: ["sharing", "family", "permissions"]
    },
    {
      id: "5",
      question: "How do I categorize my assets?",
      answer: "Assets are automatically categorized based on document type and content. You can also manually assign categories and subcategories, add tags, and create custom organization systems that work for you.",
      category: "assets",
      tags: ["categorization", "organization", "tags"]
    },
    {
      id: "6",
      question: "What happens if I lose access to my account?",
      answer: "We have multiple recovery options including email verification, phone verification, and security questions. For additional security, we recommend enabling two-factor authentication.",
      category: "security",
      tags: ["recovery", "access", "2fa"]
    },
    {
      id: "7",
      question: "How much storage do I get?",
      answer: "Storage limits depend on your plan. Basic plans include 10GB, Premium plans include 100GB, and Enterprise plans include unlimited storage. Contact us if you need more storage.",
      category: "billing",
      tags: ["storage", "limits", "plans"]
    },
    {
      id: "8",
      question: "Can I export my data?",
      answer: "Yes, you can export your data at any time in various formats including PDF, CSV, and JSON. This ensures you always have access to your information and can migrate if needed.",
      category: "documents",
      tags: ["export", "backup", "migration"]
    }
  ]

  const filteredFAQs = faqs.filter(faq => 
    (selectedCategory === "all" || faq.category === selectedCategory) &&
    (searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", contactForm)
    setShowContactForm(false)
    setContactForm({ name: "", email: "", subject: "", message: "", priority: "medium" })
  }

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions, get support, and learn how to make the most of Archeion
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-slate-200 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? "bg-slate-100 text-slate-900"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        {category.name}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Can't find what you're looking for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowContactForm(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Documentation</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Comprehensive guides and tutorials
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Video Tutorials</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Step-by-step video guides
                  </p>
                  <Button variant="outline" size="sm">
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Community</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Connect with other users
                  </p>
                  <Button variant="outline" size="sm">
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* FAQs */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  {filteredFAQs.length} questions found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <h3 className="font-medium text-slate-900">{faq.question}</h3>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4">
                          <p className="text-slate-600 mb-3">{faq.answer}</p>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No questions found</h3>
                      <p className="text-slate-600 mb-4">
                        Try adjusting your search terms or browse all categories
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Form Modal */}
            {showContactForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl border-0 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Contact Support</CardTitle>
                      <CardDescription>We'll get back to you within 24 hours</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowContactForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          value={contactForm.priority}
                          onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                          className="w-full border border-slate-200 rounded-md px-3 py-2"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button type="submit" className="flex-1">
                          Send Message
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowContactForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Support Options */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Other Ways to Get Help</CardTitle>
                <CardDescription>Choose the method that works best for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-slate-900">Live Chat</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Chat with our support team in real-time
                    </p>
                    <Button variant="outline" size="sm">
                      Start Chat
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-slate-900">Phone Support</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Call us at +1 (555) 123-4567
                    </p>
                    <p className="text-xs text-slate-500">
                      Available Mon-Fri, 9AM-6PM EST
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium text-slate-900">Email Support</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Send us an email at support@archeion.com
                    </p>
                    <p className="text-xs text-slate-500">
                      Response within 24 hours
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium text-slate-900">Response Times</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      We're committed to quick responses
                    </p>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>• Live Chat: Immediate</p>
                      <p>• Phone: Immediate</p>
                      <p>• Email: Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
