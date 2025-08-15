import { z } from 'zod'

// Document upload validation
export const DocumentUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB max
    'File size must be less than 10MB'
  ),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).default([]),
  userId: z.string().uuid('Invalid user ID'),
})

// SMS webhook validation
export const SMSWebhookSchema = z.object({
  from: z.string().min(1, 'Phone number is required'),
  body: z.string().min(1, 'Message body is required'),
  mediaUrl: z.array(z.string().url('Invalid media URL')).default([]),
  timestamp: z.date().default(() => new Date()),
})

// Document analysis request validation
export const DocumentAnalysisSchema = z.object({
  documentId: z.string().uuid('Invalid document ID'),
  userId: z.string().uuid('Invalid user ID'),
  analysisType: z.enum(['basic', 'detailed', 'compliance']).default('basic'),
})

// User preferences validation
export const UserPreferencesSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  notifications: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true),
  }),
  privacy: z.object({
    shareAnalytics: z.boolean().default(false),
    allowMarketing: z.boolean().default(false),
  }),
  preferences: z.object({
    language: z.enum(['en', 'es', 'fr']).default('en'),
    timezone: z.string().default('UTC'),
    currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  }),
})

// Search and filter validation
export const DocumentSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  status: z.enum(['uploading', 'processing', 'analyzed', 'error']).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// Insight generation validation
export const InsightGenerationSchema = z.object({
  documentId: z.string().uuid('Invalid document ID'),
  userId: z.string().uuid('Invalid user ID'),
  insightTypes: z.array(z.enum([
    'tax_optimization',
    'insurance_gap',
    'investment_opportunity',
    'compliance_check',
    'risk_assessment'
  ])).default(['tax_optimization']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

// Type exports
export type DocumentUpload = z.infer<typeof DocumentUploadSchema>
export type SMSWebhook = z.infer<typeof SMSWebhookSchema>
export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>
export type UserPreferences = z.infer<typeof UserPreferencesSchema>
export type DocumentSearch = z.infer<typeof DocumentSearchSchema>
export type InsightGeneration = z.infer<typeof InsightGenerationSchema>

// Validation helper functions
export function validateDocumentUpload(data: unknown): DocumentUpload {
  return DocumentUploadSchema.parse(data)
}

export function validateSMSWebhook(data: unknown): SMSWebhook {
  return SMSWebhookSchema.parse(data)
}

export function validateDocumentAnalysis(data: unknown): DocumentAnalysis {
  return DocumentAnalysisSchema.parse(data)
}

export function validateUserPreferences(data: unknown): UserPreferences {
  return UserPreferencesSchema.parse(data)
}

export function validateDocumentSearch(data: unknown): DocumentSearch {
  return DocumentSearchSchema.parse(data)
}

export function validateInsightGeneration(data: unknown): InsightGeneration {
  return InsightGenerationSchema.parse(data)
}
