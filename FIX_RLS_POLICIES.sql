-- =====================================================
-- FIX RLS POLICIES — Run this in Supabase SQL Editor
-- =====================================================
-- This replaces the current "allow everyone everything" 
-- policies with read-only public access. Writes require
-- the service_role key (used by your backend).
-- =====================================================

-- 1. Drop all existing overly-permissive policies
DROP POLICY IF EXISTS "products_insert_policy" ON products;
DROP POLICY IF EXISTS "products_update_policy" ON products;
DROP POLICY IF EXISTS "products_delete_policy" ON products;

DROP POLICY IF EXISTS "settings_insert_policy" ON site_settings;
DROP POLICY IF EXISTS "settings_update_policy" ON site_settings;
DROP POLICY IF EXISTS "settings_delete_policy" ON site_settings;

-- Drop order policies if they exist
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_delete_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;

-- 2. Keep public read for products & settings (these power the storefront)
-- (products_select_policy and settings_select_policy should already exist)

-- 3. Allow INSERT on orders (customers need to place orders via the anon key)
CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (true);

-- 4. Allow SELECT on orders only for service_role (admin dashboard)
CREATE POLICY "orders_service_select" ON orders FOR SELECT 
  USING (auth.role() = 'service_role');

-- 5. Allow UPDATE on orders only for service_role (status changes)
CREATE POLICY "orders_service_update" ON orders FOR UPDATE 
  USING (auth.role() = 'service_role');

-- 6. Lock down writes on products & settings to service_role only
CREATE POLICY "products_service_insert" ON products FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "products_service_update" ON products FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "products_service_delete" ON products FOR DELETE 
  USING (auth.role() = 'service_role');

CREATE POLICY "settings_service_insert" ON site_settings FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "settings_service_update" ON site_settings FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "settings_service_delete" ON site_settings FOR DELETE 
  USING (auth.role() = 'service_role');

-- =====================================================
-- IMPORTANT: After running this, your admin dashboard
-- will need to use the service_role key for writes.
-- Update your .env.local to add:
--   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
-- And create a server-side supabase client that uses it.
-- =====================================================
