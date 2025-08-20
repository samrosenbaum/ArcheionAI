import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Insight {
  id: string
  type: 'deadline' | 'renewal' | 'expiration' | 'payment' | 'change' | 'opportunity'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  amount?: number
  action?: string
  category: string
  documentId?: string
  assetName?: string
  createdAt: string
  status: 'active' | 'resolved' | 'dismissed'
}

export interface InsightSummary {
  total: number
  high: number
  medium: number
  low: number
  totalSavings: number
  upcomingDeadlines: number
  expiringDocuments: number
}

export class InsightsService {
  /**
   * Get all insights for a user
   */
  static async getUserInsights(userId: string): Promise<Insight[]> {
    try {
      const { data: insights, error } = await supabase
        .from('document_insights')
        .select(`
          *,
          documents!inner(
            id,
            name,
            category,
            asset_name,
            created_at
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching insights:', error)
        return []
      }

      return insights.map(insight => ({
        id: insight.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        priority: insight.priority,
        dueDate: insight.metadata?.dueDate,
        amount: insight.metadata?.amount,
        action: insight.metadata?.action,
        category: insight.documents?.category || 'Unknown',
        documentId: insight.document_id,
        assetName: insight.documents?.asset_name,
        createdAt: insight.created_at,
        status: insight.status || 'active'
      }))
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      return []
    }
  }

  /**
   * Get insights summary for dashboard
   */
  static async getInsightsSummary(userId: string): Promise<InsightSummary> {
    try {
      const insights = await this.getUserInsights(userId)
      
      const summary: InsightSummary = {
        total: insights.length,
        high: insights.filter(i => i.priority === 'high').length,
        medium: insights.filter(i => i.priority === 'medium').length,
        low: insights.filter(i => i.priority === 'low').length,
        totalSavings: insights.reduce((sum, i) => sum + (i.amount || 0), 0),
        upcomingDeadlines: insights.filter(i => 
          i.type === 'deadline' && i.dueDate && this.daysUntil(i.dueDate) <= 30
        ).length,
        expiringDocuments: insights.filter(i => 
          i.type === 'expiration' && i.dueDate && this.daysUntil(i.dueDate) <= 60
        ).length
      }

      return summary
    } catch (error) {
      console.error('Failed to get insights summary:', error)
      return {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        totalSavings: 0,
        upcomingDeadlines: 0,
        expiringDocuments: 0
      }
    }
  }

  /**
   * Generate new insights from parsed documents
   */
  static async generateInsightsFromDocuments(userId: string): Promise<void> {
    try {
      // Get documents that haven't been processed for insights yet
      const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'analyzed')
        .is('insights_generated', false)

      if (error || !documents) {
        console.error('Error fetching documents for insight generation:', error)
        return
      }

      for (const document of documents) {
        await this.generateInsightsForDocument(document)
      }
    } catch (error) {
      console.error('Failed to generate insights from documents:', error)
    }
  }

  /**
   * Generate insights for a specific document
   */
  private static async generateInsightsForDocument(document: any): Promise<void> {
    try {
      const insights: any[] = []
      
      // Check for expiration dates
      if (document.metadata?.extractedData?.dates) {
        for (const date of document.metadata.extractedData.dates) {
          if (date.type === 'expiration' || date.type === 'renewal') {
            const daysUntil = this.daysUntil(date.value)
            if (daysUntil <= 90) {
              insights.push({
                document_id: document.id,
                user_id: document.user_id,
                type: 'deadline',
                title: `${date.type.charAt(0).toUpperCase() + date.type.slice(1)} Deadline`,
                description: `${date.description || 'Important deadline'} on ${date.value}`,
                priority: daysUntil <= 30 ? 'high' : daysUntil <= 60 ? 'medium' : 'low',
                metadata: {
                  dueDate: date.value,
                  action: 'Review and take action'
                }
              })
            }
          }
        }
      }

      // Check for payment amounts
      if (document.metadata?.extractedData?.amounts) {
        for (const amount of document.metadata.extractedData.amounts) {
          if (amount.type === 'premium' || amount.type === 'payment') {
            insights.push({
              document_id: document.id,
              user_id: document.user_id,
              type: 'payment',
              title: `${amount.type.charAt(0).toUpperCase() + amount.type.slice(1)} Due`,
              description: `${amount.description || 'Payment amount'}: ${amount.currency}${amount.value.toLocaleString()}`,
              priority: 'medium',
              metadata: {
                amount: amount.value,
                action: 'Ensure payment is made on time'
              }
            })
          }
        }
      }

      // Check for coverage changes
      if (document.metadata?.extractedData?.insurance?.coverageAmount) {
        insights.push({
          document_id: document.id,
          user_id: document.user_id,
          type: 'change',
          title: 'Coverage Amount Identified',
          description: `Insurance coverage: $${document.metadata.extractedData.insurance.coverageAmount.toLocaleString()}`,
          priority: 'low',
          metadata: {
            amount: document.metadata.extractedData.insurance.coverageAmount,
            action: 'Review coverage adequacy'
          }
        })
      }

      // Save insights to database
      if (insights.length > 0) {
        const { error: insertError } = await supabase
          .from('document_insights')
          .insert(insights)

        if (insertError) {
          console.error('Error inserting insights:', insertError)
        }
      }

      // Mark document as having insights generated
      await supabase
        .from('documents')
        .update({ insights_generated: true })
        .eq('id', document.id)

    } catch (error) {
      console.error('Failed to generate insights for document:', error)
    }
  }

  /**
   * Mark insight as resolved
   */
  static async resolveInsight(insightId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('document_insights')
        .update({ status: 'resolved' })
        .eq('id', insightId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error resolving insight:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to resolve insight:', error)
      throw error
    }
  }

  /**
   * Dismiss insight
   */
  static async dismissInsight(insightId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('document_insights')
        .update({ status: 'dismissed' })
        .eq('id', insightId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error dismissing insight:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to dismiss insight:', error)
      throw error
    }
  }

  /**
   * Get insights by category
   */
  static async getInsightsByCategory(userId: string, category: string): Promise<Insight[]> {
    try {
      const insights = await this.getUserInsights(userId)
      return insights.filter(insight => 
        insight.category.toLowerCase() === category.toLowerCase()
      )
    } catch (error) {
      console.error('Failed to get insights by category:', error)
      return []
    }
  }

  /**
   * Get insights by priority
   */
  static async getInsightsByPriority(userId: string, priority: 'high' | 'medium' | 'low'): Promise<Insight[]> {
    try {
      const insights = await this.getUserInsights(userId)
      return insights.filter(insight => insight.priority === priority)
    } catch (error) {
      console.error('Failed to get insights by priority:', error)
      return []
    }
  }

  /**
   * Search insights
   */
  static async searchInsights(userId: string, query: string): Promise<Insight[]> {
    try {
      const insights = await this.getUserInsights(userId)
      const lowerQuery = query.toLowerCase()
      
      return insights.filter(insight => 
        insight.title.toLowerCase().includes(lowerQuery) ||
        insight.description.toLowerCase().includes(lowerQuery) ||
        insight.category.toLowerCase().includes(lowerQuery) ||
        insight.assetName?.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error('Failed to search insights:', error)
      return []
    }
  }

  /**
   * Helper method to calculate days until a date
   */
  private static daysUntil(dateString: string): number {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = date.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch {
      return 999 // Return large number if date parsing fails
    }
  }
}
