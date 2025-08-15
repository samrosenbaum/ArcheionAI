import { supabase, isDemoMode } from "./supabase"
import type { Document, DocumentInsight } from "./supabase"

export class DocumentStorageService {
  // Upload document to Supabase Storage (with demo mode fallback)
  static async uploadDocument(
    file: File,
    userId: string,
    category: string,
    subcategory?: string,
    tags: string[] = [],
  ): Promise<{ document: Document; error?: string }> {
    try {
      // Demo mode - simulate upload without actual Supabase
      if (isDemoMode) {
        return this.simulateUpload(file, userId, category, subcategory, tags)
      }

      // Generate unique file path
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `${userId}/${category}/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from("documents").upload(filePath, file)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Create document record in database
      const documentData = {
        user_id: userId,
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category,
        subcategory,
        tags,
        status: "uploading" as const,
        insights_count: 0,
        metadata: {
          original_name: file.name,
          upload_timestamp: new Date().toISOString(),
        },
      }

      const { data: document, error: dbError } = await supabase.from("documents").insert(documentData).select().single()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Start document processing
      this.processDocument(document.id)

      return { document }
    } catch (error) {
      return {
        document: {} as Document,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Demo mode simulation
  private static async simulateUpload(
    file: File,
    userId: string,
    category: string,
    subcategory?: string,
    tags: string[] = [],
  ): Promise<{ document: Document; error?: string }> {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockDocument: Document = {
      id: `demo-${Date.now()}`,
      user_id: userId,
      name: file.name,
      file_path: `demo/${category}/${file.name}`,
      file_size: file.size,
      file_type: file.type,
      category,
      subcategory,
      tags,
      upload_date: new Date().toISOString(),
      status: "uploading",
      insights_count: 0,
      metadata: {
        original_name: file.name,
        upload_timestamp: new Date().toISOString(),
        demo_mode: true,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Simulate processing
    setTimeout(() => this.processDocument(mockDocument.id), 2000)

    return { document: mockDocument }
  }

  // Process document for analytics
  static async processDocument(documentId: string) {
    try {
      if (isDemoMode) {
        // Demo mode - simulate processing
        console.log(`Demo: Processing document ${documentId}`)
        return
      }

      // Update status to processing
      await supabase.from("documents").update({ status: "processing" }).eq("id", documentId)

      // Simulate document analysis (in real app, this would call OCR/AI services)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock insights based on document type
      const insights = await this.generateDocumentInsights(documentId)

      // Update document status and insights count
      await supabase
        .from("documents")
        .update({
          status: "analyzed",
          insights_count: insights.length,
        })
        .eq("id", documentId)
    } catch (error) {
      console.error("Document processing failed:", error)
      if (!isDemoMode) {
        await supabase.from("documents").update({ status: "error" }).eq("id", documentId)
      }
    }
  }

  // Generate insights from document analysis
  static async generateDocumentInsights(documentId: string): Promise<DocumentInsight[]> {
    if (isDemoMode) {
      // Return mock insights for demo
      return [
        {
          id: `insight-${Date.now()}`,
          document_id: documentId,
          user_id: "demo-user",
          type: "demo_insight",
          title: "Demo Analysis Complete",
          description: "This is a demo insight generated for testing",
          confidence: 85,
          priority: "medium" as const,
          category: "Demo",
          recommendation: "This is a demo recommendation",
          next_steps: ["Demo step 1", "Demo step 2"],
          created_at: new Date().toISOString(),
        },
      ]
    }

    const { data: document } = await supabase.from("documents").select("*").eq("id", documentId).single()

    if (!document) return []

    const insights: Partial<DocumentInsight>[] = []

    // Generate category-specific insights
    switch (document.category) {
      case "insurance":
        if (document.name.includes("2025") || document.name.includes("2024")) {
          insights.push({
            document_id: documentId,
            user_id: document.user_id,
            type: "premium_change",
            title: "Premium Analysis Complete",
            description: "Insurance premium comparison with previous year",
            confidence: 85,
            priority: "medium",
            category: "Insurance",
            recommendation: "Review coverage changes and compare with market rates",
          })
        }
        break

      case "tax":
        insights.push({
          document_id: documentId,
          user_id: document.user_id,
          type: "deduction_opportunity",
          title: "Tax Deduction Identified",
          description: "Potential deductions found in tax documents",
          confidence: 92,
          priority: "high",
          category: "Tax",
          potential_savings: 3200,
          recommendation: "Consult with tax advisor to maximize deductions",
        })
        break

      case "real-estate":
        insights.push({
          document_id: documentId,
          user_id: document.user_id,
          type: "property_value",
          title: "Property Value Analysis",
          description: "Property value assessment based on recent market data",
          confidence: 78,
          priority: "medium",
          category: "Real Estate",
          recommendation: "Consider property tax appeal if assessment is above market value",
        })
        break
    }

    // Insert insights into database
    if (insights.length > 0) {
      const { data: insertedInsights } = await supabase.from("document_insights").insert(insights).select()

      return insertedInsights || []
    }

    return []
  }

  // Get documents by category (with demo mode support)
  static async getDocumentsByCategory(userId: string, category: string) {
    if (isDemoMode) {
      // Return mock documents for demo
      return {
        data: [
          {
            id: "demo-doc-1",
            user_id: userId,
            name: `Sample ${category} Document.pdf`,
            file_path: `demo/${category}/sample.pdf`,
            file_size: 1024000,
            file_type: "application/pdf",
            category,
            subcategory: "sample",
            tags: ["demo"],
            upload_date: new Date().toISOString(),
            status: "analyzed" as const,
            insights_count: 1,
            metadata: { demo_mode: true },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        error: null,
      }
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .eq("category", category)
      .order("created_at", { ascending: false })

    return { data: data || [], error }
  }

  // Get document insights (with demo mode support)
  static async getDocumentInsights(userId: string, documentId?: string) {
    if (isDemoMode) {
      // Return mock insights for demo
      return {
        data: [
          {
            id: "demo-insight-1",
            document_id: documentId || "demo-doc-1",
            user_id: userId,
            type: "demo_insight",
            title: "Demo Analysis Complete",
            description: "This is a demo insight for testing purposes",
            confidence: 85,
            priority: "medium" as const,
            category: "Demo",
            recommendation: "This is a demo recommendation",
            next_steps: ["Demo step 1", "Demo step 2"],
            created_at: new Date().toISOString(),
          },
        ],
        error: null,
      }
    }

    let query = supabase.from("document_insights").select("*").eq("user_id", userId)

    if (documentId) {
      query = query.eq("document_id", documentId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    return { data: data || [], error }
  }

  // Delete document (with demo mode support)
  static async deleteDocument(documentId: string, userId: string) {
    if (isDemoMode) {
      console.log(`Demo: Would delete document ${documentId}`)
      return { error: null }
    }

    // Get document info
    const { data: document } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single()

    if (!document) return { error: "Document not found" }

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("documents").remove([document.file_path])

    if (storageError) {
      console.error("Storage deletion failed:", storageError)
    }

    // Delete from database (this will cascade to insights)
    const { error: dbError } = await supabase.from("documents").delete().eq("id", documentId).eq("user_id", userId)

    return { error: dbError?.message }
  }

  // Get signed URL for document viewing (with demo mode support)
  static async getDocumentUrl(filePath: string) {
    if (isDemoMode) {
      return { url: "/placeholder.svg?height=400&width=300&text=Demo+Document", error: null }
    }

    const { data, error } = await supabase.storage.from("documents").createSignedUrl(filePath, 3600) // 1 hour expiry

    return { url: data?.signedUrl, error }
  }
}

// Re-export isDemoMode for components that need it
export { isDemoMode } from "./supabase"
