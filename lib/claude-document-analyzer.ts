// Temporarily disabled due to AI SDK version compatibility issues
// TODO: Fix when AI SDK versions are aligned

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

export interface DocumentInsight {
  type: string
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  recommendation: string
  potentialSavings?: number
  nextSteps: string[]
}

export interface RiskAssessment {
  riskLevel: "low" | "medium" | "high"
  riskFactors: string[]
  recommendations: string[]
}

export interface ComplianceCheck {
  compliant: boolean
  issues: string[]
  recommendations: string[]
}

export class ClaudeDocumentAnalyzer {
  static async analyzeDocument(fileName: string, fileType: string): Promise<DocumentAnalysis> {
    // For now, return mock analysis to avoid TypeScript compatibility issues
    // TODO: Re-enable AI analysis when SDK versions are aligned
    return this.getMockAnalysis(fileName, fileType)
  }

  private static getMockAnalysis(fileName: string, fileType: string): DocumentAnalysis {
    const lowerFileName = fileName.toLowerCase()

    // Tax document analysis
    if (lowerFileName.includes("tax") || lowerFileName.includes("1040")) {
      return {
        category: "tax",
        subcategory: "tax-return",
        confidence: 92,
        tags: ["tax", "irs", "deductions", "annual"],
        extractedData: {
          year: 2024,
          filingStatus: "married-filing-jointly",
          totalIncome: 125000,
          taxesPaid: 18500,
        },
        insights: [
          {
            type: "deduction_opportunity",
            title: "Missed Deduction Opportunities",
            description: "Analysis shows potential for additional $3,200 in deductions",
            confidence: 88,
            priority: "high",
            recommendation: "Consider itemizing deductions instead of standard deduction",
            potentialSavings: 3200,
            nextSteps: [
              "Gather receipts for charitable donations",
              "Calculate home office deduction",
              "Review medical expenses",
            ],
          },
          {
            type: "tax_strategy",
            title: "Retirement Contribution Optimization",
            description: "Maximize tax-advantaged retirement contributions",
            confidence: 95,
            priority: "medium",
            recommendation: "Increase 401(k) contributions to employer match limit",
            potentialSavings: 2400,
            nextSteps: ["Contact HR about contribution changes", "Review IRA contribution limits"],
          },
        ],
        riskAssessment: {
          riskLevel: "low",
          riskFactors: ["Standard deduction may not be optimal"],
          recommendations: ["Consider tax planning consultation"],
        },
        complianceCheck: {
          compliant: true,
          issues: [],
          recommendations: ["File by April 15th deadline"],
        },
      }
    }

    // Insurance document analysis
    if (lowerFileName.includes("insurance") || lowerFileName.includes("policy")) {
      return {
        category: "insurance",
        subcategory: "policy",
        confidence: 89,
        tags: ["insurance", "coverage", "premium", "policy"],
        extractedData: {
          policyType: "auto",
          premium: 1200,
          deductible: 500,
          coverageAmount: 100000,
        },
        insights: [
          {
            type: "coverage_gap",
            title: "Coverage Gap Identified",
            description: "Current coverage may not be sufficient for high-value assets",
            confidence: 85,
            priority: "high",
            recommendation: "Consider increasing liability coverage to $500,000",
            potentialSavings: 0,
            nextSteps: ["Contact insurance agent", "Review umbrella policy options"],
          },
        ],
        riskAssessment: {
          riskLevel: "medium",
          riskFactors: ["Low liability coverage", "High deductible"],
          recommendations: ["Increase coverage limits", "Consider lower deductible"],
        },
        complianceCheck: {
          compliant: true,
          issues: [],
          recommendations: ["Review policy annually", "Update coverage as needed"],
        },
      }
    }

    // Default analysis for other documents
    return {
      category: "general",
      subcategory: "document",
      confidence: 75,
      tags: ["uploaded", "pending_review"],
      extractedData: {
        fileName: fileName,
        fileType: fileType,
        uploadDate: new Date().toISOString(),
      },
      insights: [
        {
          type: "general",
          title: "Document Uploaded Successfully",
          description: "Document has been added to your secure vault",
          confidence: 100,
          priority: "low",
          recommendation: "Review and categorize this document",
          potentialSavings: 0,
          nextSteps: ["Add tags", "Set reminders", "Link to related documents"],
        },
      ],
      riskAssessment: {
        riskLevel: "low",
        riskFactors: [],
        recommendations: ["Regular review recommended"],
      },
      complianceCheck: {
        compliant: true,
        issues: [],
        recommendations: ["Keep for record-keeping purposes"],
      },
    }
  }

  static async extractTextFromFile(file: File): Promise<string> {
    // For demo purposes, return mock extracted text based on file type
    if (file.type === "application/pdf") {
      return `Mock PDF content for ${file.name}. This would contain the actual extracted text from the PDF document including financial data, dates, amounts, and other relevant information.`
    }

    if (file.type.startsWith("image/")) {
      return `Mock OCR content for ${file.name}. This would contain text extracted from the image using OCR technology.`
    }

    // For text files, we could read the actual content
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve((e.target?.result as string) || "")
      reader.readAsText(file)
    })
  }
}
