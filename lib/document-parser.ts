import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface ParsedDocument {
  id: string
  documentType: string
  confidence: number
  extractedData: {
    // Basic document info
    documentTitle?: string
    documentNumber?: string
    issuer?: string
    recipient?: string
    
    // Financial data
    amounts: {
      value: number
      type: 'payment' | 'balance' | 'premium' | 'deductible' | 'coverage' | 'value' | 'other'
      currency: string
      description?: string
    }[]
    
    // Dates
    dates: {
      value: string
      type: 'effective' | 'expiration' | 'due' | 'issue' | 'renewal' | 'filing' | 'other'
      description?: string
    }[]
    
    // Key terms and categories
    keyTerms: string[]
    categories: string[]
    
    // Insurance specific
    insurance?: {
      policyNumber?: string
      coverageType?: string
      deductible?: number
      premium?: number
      coverageAmount?: number
    }
    
    // Real estate specific
    realEstate?: {
      propertyAddress?: string
      propertyType?: string
      squareFootage?: number
      purchasePrice?: number
      currentValue?: number
    }
    
    // Investment specific
    investment?: {
      accountNumber?: string
      accountType?: string
      balance?: number
      performance?: number
    }
    
    // Business specific
    business?: {
      businessName?: string
      ein?: string
      businessType?: string
      annualRevenue?: number
    }
    
    // Tax specific
    tax?: {
      taxYear?: string
      filingStatus?: string
      totalIncome?: number
      totalDeductions?: number
      taxLiability?: number
      refund?: number
    }
    
    // Career/License specific
    career?: {
      licenseNumber?: string
      issuingAuthority?: string
      profession?: string
      expirationDate?: string
      continuingEducationHours?: number
    }
  }
  
  insights: {
    type: 'deadline' | 'renewal' | 'expiration' | 'payment' | 'change' | 'opportunity'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    dueDate?: string
    amount?: number
    action?: string
  }[]
  
  metadata: {
    parsingVersion: string
    processingTime: number
    textLength: number
    confidence: number
    extractedAt: string
  }
}

export interface ParsingOptions {
  extractText?: boolean
  extractTables?: boolean
  extractImages?: boolean
  language?: string
  customPatterns?: RegExp[]
}

export class DocumentParser {
  private static readonly CURRENCY_PATTERNS = [
    /\$[\d,]+\.?\d*/g, // $1,234.56
    /[\d,]+\.?\d*\s*(USD|dollars?|cents?)/gi, // 1,234.56 USD
    /(USD|dollars?|cents?)\s*[\d,]+\.?\d*/gi, // USD 1,234.56
  ]
  
  private static readonly DATE_PATTERNS = [
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, // MM/DD/YYYY or MM/DD/YY
    /\b\d{4}-\d{1,2}-\d{1,2}\b/g, // YYYY-MM-DD
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi, // January 1, 2024
    /\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi, // 1 January 2024
  ]
  
  private static readonly DOCUMENT_TYPE_PATTERNS = {
    insurance: [
      /insurance\s+policy/i,
      /policy\s+number/i,
      /coverage\s+amount/i,
      /premium/i,
      /deductible/i,
      /liability\s+coverage/i,
      /umbrella\s+policy/i,
      /auto\s+insurance/i,
      /home\s+insurance/i,
      /life\s+insurance/i
    ],
    realEstate: [
      /deed/i,
      /mortgage/i,
      /property\s+tax/i,
      /closing\s+statement/i,
      /purchase\s+agreement/i,
      /rental\s+agreement/i,
      /lease/i,
      /property\s+address/i,
      /square\s+footage/i,
      /acres/i
    ],
    investment: [
      /investment\s+account/i,
      /portfolio/i,
      /balance/i,
      /performance/i,
      /return/i,
      /dividend/i,
      /capital\s+gain/i,
      /401k/i,
      /ira/i,
      /roth/i,
      /mutual\s+fund/i,
      /etf/i
    ],
    business: [
      /business\s+license/i,
      /operating\s+agreement/i,
      /articles\s+of\s+incorporation/i,
      /ein/i,
      /tax\s+id/i,
      /business\s+plan/i,
      /financial\s+statement/i,
      /profit\s+and\s+loss/i,
      /balance\s+sheet/i
    ],
    tax: [
      /tax\s+return/i,
      /form\s+1040/i,
      /form\s+1120/i,
      /w-2/i,
      /1099/i,
      /adjusted\s+gross\s+income/i,
      /tax\s+liability/i,
      /refund/i,
      /deduction/i,
      /credit/i
    ],
    career: [
      /professional\s+license/i,
      /certification/i,
      /continuing\s+education/i,
      /ce\s+hours/i,
      /renewal/i,
      /expiration/i,
      /issuing\s+authority/i,
      /professional\s+association/i
    ]
  }
  
  private static readonly KEY_TERMS_PATTERNS = [
    /effective\s+date/i,
    /expiration\s+date/i,
    /renewal\s+date/i,
    /due\s+date/i,
    /filing\s+deadline/i,
    /coverage\s+period/i,
    /policy\s+term/i,
    /annual\s+premium/i,
    /monthly\s+payment/i,
    /interest\s+rate/i,
    /principal\s+balance/i,
    /property\s+value/i,
    /market\s+value/i,
    /assessed\s+value/i,
    /account\s+balance/i,
    /portfolio\s+value/i
  ]

  /**
   * Parse a document and extract key information
   */
  static async parseDocument(
    file: File,
    userId: string,
    options: ParsingOptions = {}
  ): Promise<ParsedDocument> {
    const startTime = Date.now()
    
    try {
      console.log('Starting document parsing for:', file.name)
      
      // Extract text from document
      const text = await this.extractText(file)
      console.log('Extracted text length:', text.length)
      
      // Parse the extracted text
      const parsedData = this.parseText(text, file.name)
      
      // Generate insights based on parsed data
      const insights = this.generateInsights(parsedData, file.name)
      
      // Determine document type and confidence
      const documentType = this.determineDocumentType(text, parsedData)
      const confidence = this.calculateConfidence(parsedData, text.length)
      
      const result: ParsedDocument = {
        id: Math.random().toString(36).substr(2, 9),
        documentType,
        confidence,
        extractedData: parsedData,
        insights,
        metadata: {
          parsingVersion: '1.0.0',
          processingTime: Date.now() - startTime,
          textLength: text.length,
          confidence,
          extractedAt: new Date().toISOString()
        }
      }
      
      console.log('Document parsing completed:', result)
      return result
      
    } catch (error) {
      console.error('Document parsing error:', error)
      throw new Error(`Failed to parse document: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Extract text from various document types
   */
  private static async extractText(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      return await this.extractTextFromPDF(file)
    } else if (file.type.startsWith('image/')) {
      return await this.extractTextFromImage(file)
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return await this.extractTextFromWord(file)
    } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      return await this.extractTextFromExcel(file)
    } else {
      return await this.extractTextFromText(file)
    }
  }

  /**
   * Extract text from PDF using browser APIs
   */
  private static async extractTextFromPDF(file: File): Promise<string> {
    try {
      // For now, we'll use a simple approach
      // In production, you'd want to use a proper PDF parsing library
      const arrayBuffer = await file.arrayBuffer()
      const pdfjsLib = await import('pdfjs-dist')
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }
      
      return fullText
    } catch (error) {
      console.warn('PDF parsing failed, falling back to basic extraction:', error)
      // Fallback: return filename as text for now
      return file.name
    }
  }

  /**
   * Extract text from image using OCR
   */
  private static async extractTextFromImage(file: File): Promise<string> {
    try {
      // For now, return filename as text
      // In production, you'd integrate with an OCR service like Google Vision API
      return file.name
    } catch (error) {
      console.warn('Image OCR failed:', error)
      return file.name
    }
  }

  /**
   * Extract text from Word documents
   */
  private static async extractTextFromWord(file: File): Promise<string> {
    try {
      // For now, return filename as text
      // In production, you'd use a library like mammoth.js
      return file.name
    } catch (error) {
      console.warn('Word document parsing failed:', error)
      return file.name
    }
  }

  /**
   * Extract text from Excel spreadsheets
   */
  private static async extractTextFromExcel(file: File): Promise<string> {
    try {
      // For now, return filename as text
      // In production, you'd use a library like xlsx
      return file.name
    } catch (error) {
      console.warn('Excel parsing failed:', error)
      return file.name
    }
  }

  /**
   * Extract text from plain text files
   */
  private static async extractTextFromText(file: File): Promise<string> {
    try {
      return await file.text()
    } catch (error) {
      console.warn('Text file reading failed:', error)
      return file.name
    }
  }

  /**
   * Parse extracted text for key information
   */
  private static parseText(text: string, filename: string): ParsedDocument['extractedData'] {
    const amounts = this.extractAmounts(text)
    const dates = this.extractDates(text)
    const keyTerms = this.extractKeyTerms(text)
    const categories = this.categorizeDocument(text, filename)
    
    // Extract document-specific information
    const insurance = this.extractInsuranceInfo(text)
    const realEstate = this.extractRealEstateInfo(text)
    const investment = this.extractInvestmentInfo(text)
    const business = this.extractBusinessInfo(text)
    const tax = this.extractTaxInfo(text)
    const career = this.extractCareerInfo(text)
    
    return {
      amounts,
      dates,
      keyTerms,
      categories,
      insurance,
      realEstate,
      investment,
      business,
      tax,
      career
    }
  }

  /**
   * Extract monetary amounts from text
   */
  private static extractAmounts(text: string): ParsedDocument['extractedData']['amounts'] {
    const amounts: ParsedDocument['extractedData']['amounts'] = []
    
    // Extract currency amounts
    for (const pattern of this.CURRENCY_PATTERNS) {
      const matches = text.match(pattern)
      if (matches) {
        for (const match of matches) {
          const value = parseFloat(match.replace(/[$,]/g, ''))
          if (!isNaN(value)) {
            amounts.push({
              value,
              type: this.determineAmountType(match, text),
              currency: 'USD',
              description: this.getAmountContext(text, match)
            })
          }
        }
      }
    }
    
    return amounts
  }

  /**
   * Extract dates from text
   */
  private static extractDates(text: string): ParsedDocument['extractedData']['dates'] {
    const dates: ParsedDocument['extractedData']['dates'] = []
    
    for (const pattern of this.DATE_PATTERNS) {
      const matches = text.match(pattern)
      if (matches) {
        for (const match of matches) {
          const date = this.parseDate(match)
          if (date) {
            dates.push({
              value: date,
              type: this.determineDateType(match, text),
              description: this.getDateContext(text, match)
            })
          }
        }
      }
    }
    
    return dates
  }

  /**
   * Extract key terms from text
   */
  private static extractKeyTerms(text: string): string[] {
    const terms: string[] = []
    
    for (const pattern of this.KEY_TERMS_PATTERNS) {
      const matches = text.match(pattern)
      if (matches) {
        terms.push(...matches)
      }
    }
    
    return [...new Set(terms)] // Remove duplicates
  }

  /**
   * Categorize document based on content
   */
  private static categorizeDocument(text: string, filename: string): string[] {
    const categories: string[] = []
    
    for (const [category, patterns] of Object.entries(this.DOCUMENT_TYPE_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(text) || pattern.test(filename)) {
          categories.push(category)
          break
        }
      }
    }
    
    return [...new Set(categories)]
  }

  /**
   * Extract insurance-specific information
   */
  private static extractInsuranceInfo(text: string) {
    const policyNumber = text.match(/policy\s*#?\s*:?\s*([A-Z0-9-]+)/i)?.[1]
    const coverageType = text.match(/coverage\s*type\s*:?\s*([^.\n]+)/i)?.[1]
    const deductible = text.match(/deductible\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    const premium = text.match(/premium\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    const coverageAmount = text.match(/coverage\s*amount\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    
    if (policyNumber || coverageType || deductible || premium || coverageAmount) {
      return {
        policyNumber,
        coverageType,
        deductible: deductible ? parseFloat(deductible.replace(/,/g, '')) : undefined,
        premium: premium ? parseFloat(premium.replace(/,/g, '')) : undefined,
        coverageAmount: coverageAmount ? parseFloat(coverageAmount.replace(/,/g, '')) : undefined
      }
    }
    
    return undefined
  }

  /**
   * Extract real estate-specific information
   */
  private static extractRealEstateInfo(text: string) {
    const propertyAddress = text.match(/(?:property|address|location)\s*:?\s*([^.\n]+)/i)?.[1]
    const propertyType = text.match(/(?:property|building)\s*type\s*:?\s*([^.\n]+)/i)?.[1]
    const squareFootage = text.match(/(?:square\s*footage|sq\s*ft)\s*:?\s*([\d,]+)/i)?.[1]
    const purchasePrice = text.match(/(?:purchase|sale)\s*price\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    const currentValue = text.match(/(?:current|market|assessed)\s*value\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    
    if (propertyAddress || propertyType || squareFootage || purchasePrice || currentValue) {
      return {
        propertyAddress,
        propertyType,
        squareFootage: squareFootage ? parseInt(squareFootage.replace(/,/g, '')) : undefined,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice.replace(/,/g, '')) : undefined,
        currentValue: currentValue ? parseFloat(currentValue.replace(/,/g, '')) : undefined
      }
    }
    
    return undefined
  }

  /**
   * Extract investment-specific information
   */
  private static extractInvestmentInfo(text: string) {
    const accountNumber = text.match(/account\s*#?\s*:?\s*([A-Z0-9-]+)/i)?.[1]
    const accountType = text.match(/account\s*type\s*:?\s*([^.\n]+)/i)?.[1]
    const balance = text.match(/balance\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    const performance = text.match(/performance\s*:?\s*([+-]?\d+\.?\d*%?)/i)?.[1]
    
    if (accountNumber || accountType || balance || performance) {
      return {
        accountNumber,
        accountType,
        balance: balance ? parseFloat(balance.replace(/,/g, '')) : undefined,
        performance: performance ? parseFloat(performance.replace(/[%,]/g, '')) : undefined
      }
    }
    
    return undefined
  }

  /**
   * Extract business-specific information
   */
  private static extractBusinessInfo(text: string) {
    const businessName = text.match(/business\s*name\s*:?\s*([^.\n]+)/i)?.[1]
    const ein = text.match(/ein\s*:?\s*(\d{2}-\d{7})/i)?.[1]
    const businessType = text.match(/business\s*type\s*:?\s*([^.\n]+)/i)?.[1]
    const annualRevenue = text.match(/annual\s*revenue\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    
    if (businessName || ein || businessType || annualRevenue) {
      return {
        businessName,
        ein,
        businessType,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue.replace(/,/g, '')) : undefined
      }
    }
    
    return undefined
  }

  /**
   * Extract tax-specific information
   */
  private static extractTaxInfo(text: string) {
    const taxYear = text.match(/tax\s*year\s*:?\s*(\d{4})/i)?.[1]
    const filingStatus = text.match(/filing\s*status\s*:?\s*([^.\n]+)/i)?.[1]
    const totalIncome = text.match(/total\s*income\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    const totalDeductions = text.match(/total\s*deductions\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    const taxLiability = text.match(/tax\s*liability\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    const refund = text.match(/refund\s*:?\s*\$?([\d,]+\.?\d*)/i)?.[1]
    
    if (taxYear || filingStatus || totalIncome || totalDeductions || taxLiability || refund) {
      return {
        taxYear,
        filingStatus,
        totalIncome: totalIncome ? parseFloat(totalIncome.replace(/,/g, '')) : undefined,
        totalDeductions: totalDeductions ? parseFloat(totalDeductions.replace(/,/g, '')) : undefined,
        taxLiability: taxLiability ? parseFloat(taxLiability.replace(/,/g, '')) : undefined,
        refund: refund ? parseFloat(refund.replace(/,/g, '')) : undefined
      }
    }
    
    return undefined
  }

  /**
   * Extract career/license-specific information
   */
  private static extractCareerInfo(text: string) {
    const licenseNumber = text.match(/license\s*#?\s*:?\s*([A-Z0-9-]+)/i)?.[1]
    const issuingAuthority = text.match(/issuing\s*authority\s*:?\s*([^.\n]+)/i)?.[1]
    const profession = text.match(/profession\s*:?\s*([^.\n]+)/i)?.[1]
    const expirationDate = text.match(/expiration\s*date\s*:?\s*([^.\n]+)/i)?.[1]
    const continuingEducationHours = text.match(/continuing\s*education\s*hours?\s*:?\s*(\d+)/i)?.[1]
    
    if (licenseNumber || issuingAuthority || profession || expirationDate || continuingEducationHours) {
      return {
        licenseNumber,
        issuingAuthority,
        profession,
        expirationDate,
        continuingEducationHours: continuingEducationHours ? parseInt(continuingEducationHours) : undefined
      }
    }
    
    return undefined
  }

  /**
   * Determine document type based on content
   */
  private static determineDocumentType(text: string, parsedData: any): string {
    const categories = parsedData.categories
    
    if (categories.includes('insurance')) return 'Insurance Policy'
    if (categories.includes('realEstate')) return 'Real Estate Document'
    if (categories.includes('investment')) return 'Investment Document'
    if (categories.includes('business')) return 'Business Document'
    if (categories.includes('tax')) return 'Tax Document'
    if (categories.includes('career')) return 'Professional License'
    
    return 'General Document'
  }

  /**
   * Calculate parsing confidence score
   */
  private static calculateConfidence(parsedData: any, textLength: number): number {
    let confidence = 0
    let factors = 0
    
    // Amount extraction confidence
    if (parsedData.amounts.length > 0) {
      confidence += Math.min(parsedData.amounts.length * 10, 30)
      factors++
    }
    
    // Date extraction confidence
    if (parsedData.dates.length > 0) {
      confidence += Math.min(parsedData.dates.length * 10, 30)
      factors++
    }
    
    // Key terms confidence
    if (parsedData.keyTerms.length > 0) {
      confidence += Math.min(parsedData.keyTerms.length * 5, 20)
      factors++
    }
    
    // Categories confidence
    if (parsedData.categories.length > 0) {
      confidence += 20
      factors++
    }
    
    // Text length confidence (longer documents tend to have more extractable data)
    if (textLength > 1000) {
      confidence += 10
      factors++
    }
    
    return factors > 0 ? Math.min(confidence, 100) : 50
  }

  /**
   * Generate insights based on parsed data
   */
  private static generateInsights(parsedData: any, filename: string): ParsedDocument['insights'] {
    const insights: ParsedDocument['insights'] = []
    
    // Check for upcoming deadlines
    for (const date of parsedData.dates) {
      if (date.type === 'expiration' || date.type === 'renewal' || date.type === 'due') {
        const daysUntil = this.daysUntil(date.value)
        if (daysUntil <= 90) {
          insights.push({
            type: 'deadline',
            title: `${date.type.charAt(0).toUpperCase() + date.type.slice(1)} Deadline`,
            description: `${date.description || 'Important deadline'} on ${date.value}`,
            priority: daysUntil <= 30 ? 'high' : daysUntil <= 60 ? 'medium' : 'low',
            dueDate: date.value,
            action: 'Review and take action'
          })
        }
      }
    }
    
    // Check for payment amounts
    for (const amount of parsedData.amounts) {
      if (amount.type === 'premium' || amount.type === 'payment') {
        insights.push({
          type: 'payment',
          title: `${amount.type.charAt(0).toUpperCase() + amount.type.slice(1)} Due`,
          description: `${amount.description || 'Payment amount'}: ${amount.currency}${amount.value.toLocaleString()}`,
          priority: 'medium',
          amount: amount.value,
          action: 'Ensure payment is made on time'
        })
      }
    }
    
    // Check for coverage changes
    if (parsedData.insurance?.coverageAmount) {
      insights.push({
        type: 'change',
        title: 'Coverage Amount Identified',
        description: `Insurance coverage: ${parsedData.insurance.currency || '$'}${parsedData.insurance.coverageAmount.toLocaleString()}`,
        priority: 'low',
        amount: parsedData.insurance.coverageAmount,
        action: 'Review coverage adequacy'
      })
    }
    
    return insights
  }

  /**
   * Helper methods
   */
  private static determineAmountType(match: string, context: string): ParsedDocument['extractedData']['amounts'][0]['type'] {
    const lowerContext = context.toLowerCase()
    if (lowerContext.includes('premium')) return 'premium'
    if (lowerContext.includes('deductible')) return 'deductible'
    if (lowerContext.includes('coverage')) return 'coverage'
    if (lowerContext.includes('payment')) return 'payment'
    if (lowerContext.includes('balance')) return 'balance'
    if (lowerContext.includes('value')) return 'value'
    return 'other'
  }

  private static determineDateType(match: string, context: string): ParsedDocument['extractedData']['dates'][0]['type'] {
    const lowerContext = context.toLowerCase()
    if (lowerContext.includes('effective')) return 'effective'
    if (lowerContext.includes('expiration') || lowerContext.includes('expires')) return 'expiration'
    if (lowerContext.includes('renewal')) return 'renewal'
    if (lowerContext.includes('due')) return 'due'
    if (lowerContext.includes('issue')) return 'issue'
    if (lowerContext.includes('filing')) return 'filing'
    return 'other'
  }

  private static getAmountContext(text: string, amount: string): string {
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.includes(amount)) {
        return line.trim()
      }
    }
    return ''
  }

  private static getDateContext(text: string, date: string): string {
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.includes(date)) {
        return line.trim()
      }
    }
    return ''
  }

  private static parseDate(dateString: string): string | null {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return null
      return date.toISOString().split('T')[0]
    } catch {
      return null
    }
  }

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

  /**
   * Save parsed document to database
   */
  static async saveParsedDocument(
    documentId: string,
    parsedData: ParsedDocument,
    userId: string
  ): Promise<void> {
    try {
      // Save insights to document_insights table
      for (const insight of parsedData.insights) {
        await supabase
          .from('document_insights')
          .insert({
            document_id: documentId,
            user_id: userId,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            priority: insight.priority,
            metadata: {
              dueDate: insight.dueDate,
              amount: insight.amount,
              action: insight.action
            }
          })
      }
      
      // Update document with parsing metadata
      await supabase
        .from('documents')
        .update({
          status: 'analyzed',
          insights_count: parsedData.insights.length,
          metadata: {
            ...parsedData.metadata,
            documentType: parsedData.documentType,
            confidence: parsedData.confidence,
            extractedData: parsedData.extractedData
          }
        })
        .eq('id', documentId)
      
      console.log('Parsed document saved successfully')
      
    } catch (error) {
      console.error('Failed to save parsed document:', error)
      throw error
    }
  }
}
