// Centralized types for the Archeion AI application

// User types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    shareAnalytics: boolean
    allowMarketing: boolean
  }
  preferences: {
    language: 'en' | 'es' | 'fr'
    timezone: string
    currency: 'USD' | 'EUR' | 'GBP'
  }
  created_at: string
  updated_at: string
}

// Document types
export interface Document {
  id: string
  user_id: string
  name: string
  file_path: string
  file_size: number
  file_type: string
  category: string
  subcategory?: string
  tags: string[]
  upload_date: string
  status: 'uploading' | 'processing' | 'analyzed' | 'error'
  insights_count: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DocumentInsight {
  id: string
  document_id: string
  user_id: string
  type: string
  title: string
  description: string
  old_value?: string
  new_value?: string
  change_percentage?: number
  confidence: number
  priority: 'high' | 'medium' | 'low'
  category: string
  potential_savings?: number
  recommendation: string
  next_steps: string[]
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  description: string
  document_count: number
  total_value?: number
  last_updated: string
}

// AI Analysis types
export interface DocumentAnalysis {
  category: string
  subcategory?: string
  confidence: number
  tags: string[]
  extractedData: Record<string, any>
  insights: DocumentInsight[]
  riskAssessment?: RiskAssessment
  complianceCheck?: ComplianceCheck
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high'
  riskFactors: string[]
  recommendations: string[]
}

export interface ComplianceCheck {
  compliant: boolean
  issues: string[]
  recommendations: string[]
}

// SMS types
export interface SMSMessage {
  from: string
  body: string
  mediaUrl?: string[]
  timestamp: Date
}

export interface SMSResponse {
  success: boolean
  message?: string
  error?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    message: string
    code?: string
    statusCode: number
    details?: any
  }
}

// Form types
export interface DocumentUploadForm {
  file: File
  category: string
  subcategory?: string
  tags: string[]
  description?: string
}

export interface SearchFilters {
  query: string
  category?: string
  dateFrom?: string
  dateTo?: string
  status?: Document['status']
  tags?: string[]
}

// UI Component types
export interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface MenuItem {
  id: string
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  disabled?: boolean
  children?: MenuItem[]
}

// Notification types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
  createdAt: Date
}

// Chart and Analytics types
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

export interface AnalyticsSummary {
  totalDocuments: number
  totalInsights: number
  potentialSavings: number
  documentsByCategory: Record<string, number>
  insightsByPriority: Record<string, number>
  recentActivity: Array<{
    id: string
    action: string
    document: string
    category: string
    timestamp: string
    status: string
  }>
}

// Error types
export interface AppError {
  message: string
  code?: string
  statusCode: number
  details?: any
}

// Utility types
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: Status
  error: string | null
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export interface EmptyStateProps extends BaseComponentProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ComponentType<{ className?: string }>
}
