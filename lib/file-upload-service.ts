import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  category: string
  subcategory: string
  tags: string[]
  description: string
  assetId?: string
  uploadDate: string
  filePath?: string
  error?: string
}

export interface FileUploadOptions {
  category?: string
  subcategory?: string
  tags?: string[]
  description?: string
  assetId?: string
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

  static async uploadFile(
    file: File,
    userId: string,
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Generate unique file path
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
      const filePath = `${userId}/${fileName}`

      // Upload to Supabase storage
      const { data: _data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Create document record in database
      const documentData = {
        user_id: userId,
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category: options.category || 'uncategorized',
        subcategory: options.subcategory || '',
        tags: options.tags || [],
        status: 'uploading',
        metadata: {
          originalName: file.name,
          uploadDate: new Date().toISOString(),
          description: options.description || '',
          assetId: options.assetId || null
        }
      }

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single()

      if (docError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('documents').remove([filePath])
        throw new Error(`Database insert failed: ${docError.message}`)
      }

      // Return the uploaded file object
      return {
        id: docData.id,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'completed',
        progress: 100,
        category: options.category || 'uncategorized',
        subcategory: options.subcategory || '',
        tags: options.tags || [],
        description: options.description || '',
        assetId: options.assetId,
        uploadDate: new Date().toISOString(),
        filePath: filePath
      }

    } catch (error) {
      console.error('File upload error:', error)
      throw error
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
        throw new Error(`Failed to get file URL: ${error.message}`)
      }

      return data.signedUrl
    } catch (error) {
      console.error('Get file URL error:', error)
      throw error
    }
  }

  static async getUserDocuments(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Get user documents error:', error)
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
