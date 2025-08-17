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

-- Create career_licenses table
CREATE TABLE IF NOT EXISTS career_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  license_number TEXT,
  issuing_organization TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  issue_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  renewal_frequency_months INTEGER DEFAULT 12,
  renewal_requirements TEXT[] DEFAULT '{}',
  continuing_education_hours_required INTEGER DEFAULT 0,
  continuing_education_hours_completed INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'expired', 'pending_renewal', 'suspended')) DEFAULT 'active',
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  notes TEXT,
  document_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create license_renewals table
CREATE TABLE IF NOT EXISTS license_renewals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id UUID REFERENCES career_licenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  renewal_date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')) DEFAULT 'pending',
  documents_submitted TEXT[] DEFAULT '{}',
  fees_paid BOOLEAN DEFAULT FALSE,
  continuing_education_completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create continuing_education table
CREATE TABLE IF NOT EXISTS continuing_education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id UUID REFERENCES career_licenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  activity_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  hours_earned DECIMAL(5,2) NOT NULL,
  activity_date DATE NOT NULL,
  category TEXT,
  certificate_document_id UUID,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
('personal', 'Users', 'from-cyan-500 to-blue-500', 'Personal documents, identification, and miscellaneous files'),
('career', 'GraduationCap', 'from-indigo-500 to-purple-600', 'Professional licenses, certifications, and career documents')
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;

DROP POLICY IF EXISTS "Users can view their own insights" ON document_insights;
DROP POLICY IF EXISTS "System can insert insights" ON document_insights;

DROP POLICY IF EXISTS "Users can view categories" ON categories;

-- Career licenses RLS policies
DROP POLICY IF EXISTS "Users can view their own licenses" ON career_licenses;
DROP POLICY IF EXISTS "Users can insert their own licenses" ON career_licenses;
DROP POLICY IF EXISTS "Users can update their own licenses" ON career_licenses;
DROP POLICY IF EXISTS "Users can delete their own licenses" ON career_licenses;

-- License renewals RLS policies
DROP POLICY IF EXISTS "Users can view their own renewals" ON license_renewals;
DROP POLICY IF EXISTS "Users can insert their own renewals" ON license_renewals;
DROP POLICY IF EXISTS "Users can update their own renewals" ON license_renewals;
DROP POLICY IF EXISTS "Users can delete their own renewals" ON license_renewals;

-- Continuing education RLS policies
DROP POLICY IF EXISTS "Users can view their own CE activities" ON continuing_education;
DROP POLICY IF EXISTS "Users can insert their own CE activities" ON continuing_education;
DROP POLICY IF EXISTS "Users can update their own CE activities" ON continuing_education;
DROP POLICY IF EXISTS "Users can delete their own CE activities" ON continuing_education;

-- Now create the policies
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

-- Career licenses RLS policies
CREATE POLICY "Users can view their own licenses" ON career_licenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own licenses" ON career_licenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own licenses" ON career_licenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own licenses" ON career_licenses
  FOR DELETE USING (auth.uid() = user_id);

-- License renewals RLS policies
CREATE POLICY "Users can view their own renewals" ON license_renewals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own renewals" ON license_renewals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own renewals" ON license_renewals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own renewals" ON license_renewals
  FOR DELETE USING (auth.uid() = user_id);

-- Continuing education RLS policies
CREATE POLICY "Users can view their own CE activities" ON continuing_education
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CE activities" ON continuing_education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CE activities" ON continuing_education
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CE activities" ON continuing_education
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_document_insights_user_id ON document_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_document_insights_document_id ON document_insights(document_id);

-- Career licenses indexes
CREATE INDEX IF NOT EXISTS idx_career_licenses_user_id ON career_licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_career_licenses_category ON career_licenses(category);
CREATE INDEX IF NOT EXISTS idx_career_licenses_status ON career_licenses(status);
CREATE INDEX IF NOT EXISTS idx_career_licenses_expiration_date ON career_licenses(expiration_date);
CREATE INDEX IF NOT EXISTS idx_career_licenses_issuing_organization ON career_licenses(issuing_organization);

-- License renewals indexes
CREATE INDEX IF NOT EXISTS idx_license_renewals_user_id ON license_renewals(user_id);
CREATE INDEX IF NOT EXISTS idx_license_renewals_license_id ON license_renewals(license_id);
CREATE INDEX IF NOT EXISTS idx_license_renewals_status ON license_renewals(status);
CREATE INDEX IF NOT EXISTS idx_license_renewals_renewal_date ON license_renewals(renewal_date);

-- Continuing education indexes
CREATE INDEX IF NOT EXISTS idx_continuing_education_user_id ON continuing_education(user_id);
CREATE INDEX IF NOT EXISTS idx_continuing_education_license_id ON continuing_education(license_id);
CREATE INDEX IF NOT EXISTS idx_continuing_education_status ON continuing_education(status);
CREATE INDEX IF NOT EXISTS idx_continuing_education_activity_date ON continuing_education(activity_date);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
