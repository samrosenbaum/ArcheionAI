import { createClient } from "@supabase/supabase-js"

// Environment variables - must be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Running in demo mode.")
}

// Create client with error handling
export const supabase = createClient(
  supabaseUrl || "https://demo.supabase.co",
  supabaseAnonKey || "demo-key",
  {
    auth: {
      persistSession: false, // Disable for demo mode
    },
  }
)

// Check if we're in demo mode (no real Supabase connection)
export const isDemoMode = !supabaseUrl || !supabaseAnonKey

// Types for our database
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
  status: "uploading" | "processing" | "analyzed" | "error"
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
  priority: "high" | "medium" | "low"
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
