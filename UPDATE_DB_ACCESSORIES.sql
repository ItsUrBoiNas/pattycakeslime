-- RUN THIS IN SUPABASE SQL EDITOR

create table if not exists accessories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price decimal(10, 2) not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table accessories enable row level security;

-- Policies
create policy "Allow public read access on accessories"
on accessories for select using (true);

create policy "Allow authenticated insert on accessories"
on accessories for insert with check (auth.role() = 'anon'); -- For now, using anon key for admin too

create policy "Allow authenticated update on accessories"
on accessories for update using (auth.role() = 'anon');

create policy "Allow authenticated delete on accessories"
on accessories for delete using (auth.role() = 'anon');
