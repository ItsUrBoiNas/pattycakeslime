-- RUN THIS IN THE SUPABASE SQL EDITOR --

-- 1. Create a table for products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  tag TEXT,
  image_url TEXT,
  is_pre_made BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for site settings (like the live status message)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Insert initial live status if it doesn't exist
INSERT INTO site_settings (key, value) 
VALUES ('live_status', 'Patti is stirring up something special! Check back soon! ✨')
ON CONFLICT (key) DO NOTHING;

-- 4. Insert initial products (optional, based on your current items)
-- INSERT INTO products (name, price, tag, is_pre_made) VALUES ('Blue Rocks', 5.00, 'CYAN', true);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read
CREATE POLICY "products_select_policy" ON products FOR SELECT USING (true);
CREATE POLICY "settings_select_policy" ON site_settings FOR SELECT USING (true);

-- Allow everyone to insert, update, delete (since we're using custom auth on /patty)
CREATE POLICY "products_insert_policy" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_policy" ON products FOR UPDATE USING (true);
CREATE POLICY "products_delete_policy" ON products FOR DELETE USING (true);

CREATE POLICY "settings_insert_policy" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "settings_update_policy" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "settings_delete_policy" ON site_settings FOR DELETE USING (true);
