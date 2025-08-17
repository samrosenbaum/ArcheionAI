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

-- Create specialized document metadata tables
-- Insurance documents
CREATE TABLE IF NOT EXISTS insurance_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  policy_number TEXT,
  insurance_company TEXT NOT NULL,
  policy_type TEXT NOT NULL,
  coverage_amount DECIMAL(12,2),
  premium_amount DECIMAL(10,2),
  deductible_amount DECIMAL(10,2),
  effective_date DATE,
  expiration_date DATE,
  renewal_frequency_months INTEGER DEFAULT 12,
  beneficiaries TEXT[],
  riders TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real estate documents
CREATE TABLE IF NOT EXISTS real_estate_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  property_address TEXT NOT NULL,
  property_type TEXT,
  square_footage INTEGER,
  acres DECIMAL(8,2),
  purchase_price DECIMAL(12,2),
  current_value DECIMAL(12,2),
  property_tax_amount DECIMAL(10,2),
  property_tax_due_date DATE,
  mortgage_amount DECIMAL(12,2),
  mortgage_rate DECIMAL(5,4),
  mortgage_term_years INTEGER,
  hoa_fees DECIMAL(8,2),
  hoa_frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle documents
CREATE TABLE IF NOT EXISTS vehicle_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vehicle_vin TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  registration_expiry DATE,
  insurance_policy_number TEXT,
  loan_amount DECIMAL(10,2),
  loan_rate DECIMAL(5,4),
  loan_term_months INTEGER,
  warranty_expiry DATE,
  maintenance_schedule TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Healthcare documents
CREATE TABLE IF NOT EXISTS healthcare_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  healthcare_provider TEXT,
  patient_name TEXT,
  diagnosis TEXT,
  treatment TEXT,
  prescription_details TEXT,
  appointment_date DATE,
  follow_up_date DATE,
  insurance_coverage TEXT,
  out_of_pocket_cost DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal documents
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  legal_firm TEXT,
  attorney_name TEXT,
  case_number TEXT,
  court_name TEXT,
  filing_date DATE,
  hearing_date DATE,
  settlement_amount DECIMAL(12,2),
  legal_fees DECIMAL(10,2),
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment documents
CREATE TABLE IF NOT EXISTS investment_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  account_number TEXT,
  account_type TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  balance_amount DECIMAL(12,2),
  performance_percentage DECIMAL(5,2),
  risk_level TEXT,
  investment_strategy TEXT,
  beneficiary_designations TEXT[],
  contribution_limit DECIMAL(10,2),
  required_minimum_distribution DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax documents
CREATE TABLE IF NOT EXISTS tax_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  tax_year TEXT NOT NULL,
  filing_status TEXT,
  filing_type TEXT,
  total_income DECIMAL(12,2),
  adjusted_gross_income DECIMAL(12,2),
  total_deductions DECIMAL(10,2),
  tax_liability DECIMAL(10,2),
  refund_amount DECIMAL(10,2),
  payment_amount DECIMAL(10,2),
  filing_deadline DATE,
  extension_filed BOOLEAN DEFAULT FALSE,
  extension_deadline DATE,
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

-- Insert comprehensive categories
INSERT INTO categories (name, icon, color, description) VALUES
-- Core Financial & Legal
('insurance', 'Shield', 'from-slate-500 to-slate-600', 'Insurance policies and coverage documents'),
('tax', 'FileText', 'from-slate-500 to-slate-600', 'Tax returns, receipts, and tax-related documents'),
('real-estate', 'Home', 'from-slate-500 to-slate-600', 'Property deeds, mortgages, and real estate documents'),
('vehicle', 'Car', 'from-slate-500 to-slate-600', 'Vehicle titles, registrations, and automotive documents'),
('business', 'Building', 'from-slate-500 to-slate-600', 'Business formation, operating agreements, and corporate documents'),
('personal', 'Users', 'from-slate-500 to-slate-600', 'Personal documents, identification, and miscellaneous files'),
('career', 'GraduationCap', 'from-slate-500 to-slate-600', 'Professional licenses, certifications, and career documents'),

-- Identity & Vital Records
('identity', 'CreditCard', 'from-slate-500 to-slate-600', 'Birth certificates, passports, driver licenses, IDs'),
('healthcare', 'Heart', 'from-slate-500 to-slate-600', 'Medical records, prescriptions, health insurance'),
('legal', 'Scale', 'from-slate-500 to-slate-600', 'Wills, trusts, power of attorney, legal contracts'),
('education', 'BookOpen', 'from-slate-500 to-slate-600', 'Diplomas, transcripts, student loans, certifications'),
('investments', 'TrendingUp', 'from-slate-500 to-slate-600', 'Investment accounts, retirement plans, stock certificates'),
('banking', 'CreditCard', 'from-slate-500 to-slate-600', 'Bank statements, credit cards, loan documents'),
('contracts', 'FileContract', 'from-slate-500 to-slate-600', 'Service contracts, warranties, subscription agreements'),
('family', 'Users', 'from-slate-500 to-slate-600', 'Family documents, custody, support agreements'),
('emergency', 'AlertTriangle', 'from-slate-500 to-slate-600', 'Emergency contacts, evacuation plans, medical info'),
('miscellaneous', 'Archive', 'from-slate-500 to-slate-600', 'Travel documents, pet records, memberships')
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
