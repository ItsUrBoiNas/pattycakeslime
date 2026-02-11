-- RUN THIS IN THE SUPABASE SQL EDITOR

-- 1. Create the storage bucket for product images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up security policies for the bucket

-- Allow public read access to product images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

-- Allow authenticated users (or everyone for this simple app) to upload images
CREATE POLICY "Allow Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' );

-- Allow updating/replacing images
CREATE POLICY "Allow Updates" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'product-images' );

-- Allow deleting images
CREATE POLICY "Allow Deletes" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'product-images' );
