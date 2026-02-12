-- Add image_url column to accessories table
ALTER TABLE accessories 
ADD COLUMN IF NOT EXISTS image_url text;

-- Ensure the column is public (RLS policies already exist, but good to double check if we need specific column security, 
-- though the existing 'select' policy uses (true) which covers all columns)
