-- RUN THIS IN SUPABASE SQL EDITOR

create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table site_settings enable row level security;

-- Policies
create policy "Allow public read access on site_settings"
on site_settings for select using (true);

create policy "Allow authenticated upsert on site_settings"
on site_settings for upsert with check (auth.role() = 'anon'); -- Using anon for now as per previous pattern

-- Seed default values
insert into site_settings (key, value)
values 
  ('hero_headline', 'PICK YOUR FLAVOR'),
  ('hero_subheadline', 'OFFICIAL MENU'),
  ('announcement_bar', 'Fast Shipping & Live Builds! ✨'),
  ('about_text', 'Patti has been making slime since 2016. What started as a hobby in her kitchen turned into a mission to spread joy through the most satisfying, high-quality slime on the planet.')
on conflict (key) do nothing;
