import { createClient } from '@supabase/supabase-js'
import { DocumentParser, ParsedDocument } from './document-parser'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'processing' | 'completed' | 'error' | 'saved'
  progress: number
  category: string
  subcategory: string
  tags: string[]
  description: string
  assetName?: string
  uploadDate: string
  filePath?: string
  error?: string
  originalFile?: File // Store the original File object for upload
}

export interface FileUploadOptions {
  category?: string
  subcategory?: string
  tags?: string[]
  description?: string
  assetName?: string
}

export class FileUploadService {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size must be less than ${this.formatFileSize(this.MAX_FILE_SIZE)}`
      }
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload PDF, image, or document files.'
      }
    }

    return { valid: true }
  }

  // Upload file to Supabase Storage only
  static async uploadToStorage(
    file: File,
    userId: string,
    assetName?: string
  ): Promise<{ filePath: string; url: string }> {
    try {
      console.log('Uploading file to storage:', file.name)
      
      // Generate unique file path with asset organization
      const timestamp = Date.now()
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${timestamp}-${safeFileName}`
      
      // Organize by user -> asset -> files
      const filePath = assetName 
        ? `${userId}/${assetName}/${fileName}`
        : `${userId}/${fileName}`
      
      console.log('Generated storage path:', filePath)

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw new Error(`Storage upload failed: ${error.message}`)
      }
      
      console.log('Storage upload successful')

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      return {
        filePath,
        url: urlData.publicUrl
      }
      
    } catch (error) {
      console.error('Upload to storage failed:', error)
      throw error
    }
  }

  // Save document metadata to database
  static async saveDocumentMetadata(
    file: File,
    userId: string,
    filePath: string,
    assetName: string,
    category: string,
    subcategory: string,
    tags: string[] = []
  ): Promise<string> {
    try {
      console.log('Saving document metadata to database')
      
      const documentData = {
        user_id: userId,
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category: category || 'uncategorized',
        subcategory: subcategory || '',
        tags: tags,
        asset_name: assetName,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single()

      if (docError) {
        console.error('Database insert error:', docError)
        throw new Error(`Database insert failed: ${docError.message}`)
      }
      
      console.log('Document metadata saved:', docData.id)
      return docData.id
      
    } catch (error) {
      console.error('Save metadata failed:', error)
      throw error
    }
  }

  // Main upload method - orchestrates the entire process
  static async uploadFile(
    file: File,
    userId: string,
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    try {
      console.log('FileUploadService.uploadFile called with:', { file: file.name, userId, options })
      
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Step 1: Upload to storage
      const { filePath } = await this.uploadToStorage(file, userId, options.assetName)
      
      // Step 2: Save metadata to database
      const documentId = await this.saveDocumentMetadata(
        file,
        userId,
        filePath,
        options.assetName || 'Uncategorized',
        options.category || 'uncategorized',
        options.subcategory || '',
        options.tags || []
      )
      
      // Step 3: Parse document for insights (async, don't block upload)
      this.parseDocumentAsync(file, documentId, userId)
      
      // Return success response
      return {
        id: documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'completed',
        progress: 100,
        category: options.category || 'uncategorized',
        subcategory: options.subcategory || '',
        tags: options.tags || [],
        description: options.description || '',
        assetName: options.assetName,
        uploadDate: new Date().toISOString(),
        filePath: filePath
      }
      
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }

  // Parse document asynchronously
  private static async parseDocumentAsync(file: File, documentId: string, userId: string) {
    try {
      console.log('Starting async document parsing for:', documentId)
      const parsedDocument = await DocumentParser.parseDocument(file, userId)
      
      // Save parsing results
      await this.saveParsingResults(documentId, parsedDocument, userId)
      
    } catch (error) {
      console.warn('Async parsing failed for document:', documentId, error)
      // Don't fail the upload for parsing errors
    }
  }

  // Save parsing results to database
  private static async saveParsingResults(
    documentId: string,
    parsedDocument: ParsedDocument,
    userId: string
  ) {
    try {
      const insightData = {
        user_id: userId,
        document_id: documentId,
        extracted_text: JSON.stringify(parsedDocument.extractedData),
        confidence: parsedDocument.confidence,
        categories: parsedDocument.extractedData.categories,
        amounts: parsedDocument.extractedData.amounts,
        dates: parsedDocument.extractedData.dates,
        key_terms: parsedDocument.extractedData.keyTerms,
        insights: parsedDocument.insights,
        created_at: new Date().toISOString()
      }

      const { error: insightError } = await supabase
        .from('document_insights')
        .insert([insightData])

      if (insightError) {
        console.error('Insight save error:', insightError)
      } else {
        console.log('Parsing results saved for document:', documentId)
      }
      
    } catch (error) {
      console.error('Save parsing results failed:', error)
    }
  }



  static async deleteFile(filePath: string, userId: string): Promise<void> {
    try {
      // Verify user owns the file
      const { data: doc, error: fetchError } = await supabase
        .from('documents')
        .select('user_id')
        .eq('file_path', filePath)
        .single()

      if (fetchError || !doc) {
        throw new Error('Document not found')
      }

      if (doc.user_id !== userId) {
        throw new Error('Unauthorized to delete this file')
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath])

      if (storageError) {
        throw new Error(`Storage deletion failed: ${storageError.message}`)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('file_path', filePath)

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`)
      }
    } catch (error) {
      console.error('File deletion error:', error)
      throw error
    }
  }

  static async getFileUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600) // 1 hour expiry

      if (error) {
        throw new Error(`Failed to generate signed URL: ${error.message}`)
      }

      return data.signedUrl
    } catch (error) {
      console.error('Get file URL error:', error)
      throw error
    }
  }

  // Download file from storage
  static async downloadFile(filePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath)
    
    if (error) {
      throw new Error(`Download failed: ${error.message}`)
    }
    
    return data
  }

  // List files for a user/asset
  static async listUserFiles(userId: string, assetName?: string): Promise<string[]> {
    try {
      const path = assetName ? `${userId}/${assetName}` : userId
      const { data, error } = await supabase.storage
        .from('documents')
        .list(path)
      
      if (error) {
        throw new Error(`List files failed: ${error.message}`)
      }
      
      return data.map(item => item.name)
    } catch (error) {
      console.error('List files failed:', error)
      return []
    }
  }

  static async updateFileMetadata(
    fileId: string,
    userId: string,
    metadata: Partial<{
      name: string
      category: string
      subcategory: string
      tags: string[]
      description: string
    }>
  ): Promise<void> {
    try {
      // Verify user owns the file
      const { data: doc, error: fetchError } = await supabase
        .from('documents')
        .select('user_id, metadata')
        .eq('id', fileId)
        .single()

      if (fetchError || !doc) {
        throw new Error('Document not found')
      }

      if (doc.user_id !== userId) {
        throw new Error('Unauthorized to update this file')
      }

      // Update metadata
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          name: metadata.name,
          category: metadata.category,
          subcategory: metadata.subcategory,
          tags: metadata.tags,
          metadata: {
            ...doc.metadata,
            description: metadata.description,
            updatedAt: new Date().toISOString()
          }
        })
        .eq('id', fileId)

      if (updateError) {
        throw new Error(`Update failed: ${updateError.message}`)
      }
    } catch (error) {
      console.error('Update file metadata error:', error)
      throw error
    }
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
