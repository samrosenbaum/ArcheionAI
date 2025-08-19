-- Add missing asset_name column to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS asset_name TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_documents_asset_name ON documents(asset_name);

-- Update existing documents to have a default asset_name if NULL
UPDATE documents SET asset_name = 'Uncategorized' WHERE asset_name IS NULL;
