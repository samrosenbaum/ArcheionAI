-- Comprehensive database setup for Archeion AI
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable RLS
ALTER TABLE IF EXISTS documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS document_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('uploading', 'processing', 'analyzed', 'error')) DEFAULT 'uploading',
  insights_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_insights table
CREATE TABLE IF NOT EXISTS document_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  change_percentage DECIMAL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  category TEXT NOT NULL,
  potential_savings DECIMAL,
  recommendation TEXT,
  next_steps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  document_count INTEGER DEFAULT 0,
  total_value DECIMAL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, icon, color, description) VALUES
('insurance', 'Shield', 'from-blue-500 to-indigo-600', 'Insurance policies and coverage documents'),
('tax', 'FileText', 'from-emerald-500 to-teal-600', 'Tax returns, receipts, and tax-related documents'),
('real-estate', 'Home', 'from-purple-500 to-violet-600', 'Property deeds, mortgages, and real estate documents'),
('vehicle', 'Car', 'from-orange-500 to-red-500', 'Vehicle titles, registrations, and automotive documents'),
('business', 'Building', 'from-rose-500 to-pink-600', 'Business formation, operating agreements, and corporate documents'),
('personal', 'Users', 'from-cyan-500 to-blue-500', 'Personal documents, identification, and miscellaneous files')
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights" ON document_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert insights" ON document_insights
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view categories" ON categories
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_document_insights_user_id ON document_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_document_insights_document_id ON document_insights(document_id);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
