-- RUN THIS IN THE SUPABASE SQL EDITOR --

-- 1. Create a table for accessories
CREATE TABLE IF NOT EXISTS accessories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert key-value pairs for site text into site_settings
-- We use ON CONFLICT DO NOTHING to avoid errors if you run this twice
INSERT INTO site_settings (key, value) VALUES
('hero_headline', 'PICK YOUR FLAVOR'),
('hero_subheadline', 'OFFICIAL MENU'),
('about_text', 'Hi! I''m Patti, a grandma who loves making slime! I started this shop to share my creations with the world. Every slime is handmade with love and care.'),
('announcement_bar', 'Fast Shipping & Live Builds!')
ON CONFLICT (key) DO NOTHING;

-- 3. Enable RLS for accessories
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- 4. Policies for accessories
-- Everyone can read active accessories
CREATE POLICY "accessories_select_policy" ON accessories FOR SELECT USING (true);

-- Only authenticated users (Patti) can manage accessories
CREATE POLICY "accessories_insert_policy" ON accessories FOR INSERT WITH CHECK (true);
CREATE POLICY "accessories_update_policy" ON accessories FOR UPDATE USING (true);
CREATE POLICY "accessories_delete_policy" ON accessories FOR DELETE USING (true);

