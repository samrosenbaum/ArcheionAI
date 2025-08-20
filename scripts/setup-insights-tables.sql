-- Setup script for Insights and Alerts system
-- Run this in your Supabase SQL editor

-- Create document_insights table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deadline', 'renewal', 'expiration', 'payment', 'change', 'opportunity')),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_document_insights_user_id ON document_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_document_insights_status ON document_insights(status);
CREATE INDEX IF NOT EXISTS idx_document_insights_priority ON document_insights(priority);
CREATE INDEX IF NOT EXISTS idx_document_insights_type ON document_insights(type);

-- Add insights_generated column to documents table if it doesn't exist
ALTER TABLE documents ADD COLUMN IF NOT EXISTS insights_generated BOOLEAN DEFAULT FALSE;

-- Add insights_count column to documents table if it doesn't exist
ALTER TABLE documents ADD COLUMN IF NOT EXISTS insights_count INTEGER DEFAULT 0;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_document_insights_updated_at ON document_insights;
CREATE TRIGGER update_document_insights_updated_at
  BEFORE UPDATE ON document_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE document_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own insights" ON document_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights" ON document_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" ON document_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights" ON document_insights
  FOR DELETE USING (auth.uid() = user_id);

-- Insert some sample insights for testing (optional)
-- INSERT INTO document_insights (document_id, user_id, type, title, description, priority, metadata) VALUES
--   ('sample-doc-id', 'sample-user-id', 'deadline', 'Insurance Renewal Due', 'Your auto insurance policy expires in 30 days', 'high', '{"dueDate": "2024-02-15", "action": "Review and renew policy"}'),
--   ('sample-doc-id-2', 'sample-user-id', 'payment', 'Property Tax Due', 'Property tax payment of $2,400 due soon', 'medium', '{"amount": 2400, "action": "Ensure payment is made on time"}');

-- Grant necessary permissions
GRANT ALL ON document_insights TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
