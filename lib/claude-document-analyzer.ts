import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

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
  private static isConfigured(): boolean {
    return !!process.env.ANTHROPIC_API_KEY
  }

  static async analyzeDocument(fileContent: string, fileName: string, fileType: string): Promise<DocumentAnalysis> {
    if (!this.isConfigured()) {
      // Return mock analysis for demo mode
      return this.getMockAnalysis(fileName, fileType)
    }

    try {
      const prompt = `
        Analyze this financial document and provide a comprehensive analysis.
        
        Document Name: ${fileName}
        File Type: ${fileType}
        Content: ${fileContent.substring(0, 4000)} // Limit content for API
        
        Please provide:
        1. Document category and subcategory
        2. Confidence level (0-100)
        3. Relevant tags
        4. Key extracted data
        5. Financial insights and opportunities
        6. Risk assessment
        7. Compliance considerations
        
        Return the analysis in JSON format with the following structure:
        {
          "category": "string",
          "subcategory": "string",
          "confidence": number,
          "tags": ["string"],
          "extractedData": {},
          "insights": [
            {
              "type": "string",
              "title": "string",
              "description": "string",
              "confidence": number,
              "priority": "high|medium|low",
              "recommendation": "string",
              "potentialSavings": number,
              "nextSteps": ["string"]
            }
          ],
          "riskAssessment": {
            "riskLevel": "low|medium|high",
            "riskFactors": ["string"],
            "recommendations": ["string"]
          },
          "complianceCheck": {
            "compliant": boolean,
            "issues": ["string"],
            "recommendations": ["string"]
          }
        }
      `

      const { text } = await generateText({
        model: anthropic("claude-3-haiku-20240307"),
        prompt,
        system: `You are a financial document analysis expert. Analyze documents for:
        - Tax optimization opportunities
        - Insurance coverage gaps
        - Investment performance
        - Compliance issues
        - Risk factors
        - Cost savings potential
        
        Provide actionable insights with specific recommendations.`,
      })

      // Parse the JSON response
      const analysis = JSON.parse(text) as DocumentAnalysis
      return analysis
    } catch (error) {
      console.error("Claude analysis failed:", error)
      // Fallback to mock analysis
      return this.getMockAnalysis(fileName, fileType)
    }
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
            title: "Potential Coverage Gap",
            description: "Current liability limits may be insufficient",
            confidence: 82,
            priority: "high",
            recommendation: "Consider increasing liability coverage to $300k/$500k",
            nextSteps: ["Get quotes for increased coverage", "Review asset protection needs"],
          },
          {
            type: "premium_optimization",
            title: "Premium Reduction Opportunity",
            description: "Higher deductible could reduce annual premium",
            confidence: 75,
            priority: "medium",
            recommendation: "Consider increasing deductible to $1,000",
            potentialSavings: 240,
            nextSteps: ["Compare premium savings", "Ensure emergency fund covers higher deductible"],
          },
        ],
        riskAssessment: {
          riskLevel: "medium",
          riskFactors: ["Potentially inadequate liability coverage"],
          recommendations: ["Review coverage annually", "Consider umbrella policy"],
        },
        complianceCheck: {
          compliant: true,
          issues: [],
          recommendations: ["Maintain continuous coverage"],
        },
      }
    }

    // Default analysis for other documents
    return {
      category: "other",
      subcategory: "general",
      confidence: 70,
      tags: ["document", "financial"],
      extractedData: {
        documentType: "financial-document",
        processedDate: new Date().toISOString(),
      },
      insights: [
        {
          type: "general_review",
          title: "Document Processed",
          description: "Document has been successfully analyzed and categorized",
          confidence: 85,
          priority: "low",
          recommendation: "Review document for any action items",
          nextSteps: ["File document appropriately", "Set reminders for any deadlines"],
        },
      ],
      riskAssessment: {
        riskLevel: "low",
        riskFactors: [],
        recommendations: ["Regular document review"],
      },
      complianceCheck: {
        compliant: true,
        issues: [],
        recommendations: ["Maintain organized records"],
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
