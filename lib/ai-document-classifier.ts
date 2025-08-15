import { DocumentStorageService } from "./document-storage"

export interface ClassificationResult {
  category: string
  subcategory?: string
  confidence: number
  tags: string[]
  extractedData: Record<string, any>
}

export class AIDocumentClassifier {
  static async classifyDocument(file: File): Promise<ClassificationResult> {
    // Simulate AI classification based on filename
    const fileName = file.name.toLowerCase()

    // Basic classification logic based on filename patterns
    if (fileName.includes("tax") || fileName.includes("1040") || fileName.includes("w2")) {
      return {
        category: "tax",
        subcategory: "tax-return",
        confidence: 0.95,
        tags: ["tax", "irs", "annual"],
        extractedData: {
          year: new Date().getFullYear(),
          type: "tax-document",
        },
      }
    }

    if (fileName.includes("insurance") || fileName.includes("policy")) {
      return {
        category: "insurance",
        subcategory: "policy",
        confidence: 0.88,
        tags: ["insurance", "policy", "coverage"],
        extractedData: {
          type: "insurance-policy",
        },
      }
    }

    if (fileName.includes("bank") || fileName.includes("statement")) {
      return {
        category: "banking",
        subcategory: "statement",
        confidence: 0.92,
        tags: ["banking", "statement", "financial"],
        extractedData: {
          type: "bank-statement",
        },
      }
    }

    if (fileName.includes("investment") || fileName.includes("portfolio")) {
      return {
        category: "investments",
        subcategory: "portfolio",
        confidence: 0.85,
        tags: ["investment", "portfolio", "financial"],
        extractedData: {
          type: "investment-document",
        },
      }
    }

    if (fileName.includes("real") || fileName.includes("property") || fileName.includes("deed")) {
      return {
        category: "real-estate",
        subcategory: "property",
        confidence: 0.8,
        tags: ["real-estate", "property", "legal"],
        extractedData: {
          type: "property-document",
        },
      }
    }

    // Default classification
    return {
      category: "other",
      subcategory: "general",
      confidence: 0.6,
      tags: ["document", "general"],
      extractedData: {
        type: "general-document",
      },
    }
  }

  static async processAndStore(file: File, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Classify the document
      const classification = await this.classifyDocument(file)

      // Store the document with classification
      const { error } = await DocumentStorageService.uploadDocument(
        file,
        userId,
        classification.category,
        classification.subcategory,
        classification.tags,
      )

      if (error) {
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Classification failed",
      }
    }
  }
}
