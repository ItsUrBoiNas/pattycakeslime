-- Create the viral_moments table
create table viral_moments (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  video_url text not null,
  views text,
  platform text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table viral_moments enable row level security;

-- Create policies
create policy "Public videos are viewable by everyone."
  on viral_moments for select
  using ( true );

create policy "Users can insert their own videos."
  on viral_moments for insert
  with check ( true );

create policy "Users can update their own videos."
  on viral_moments for update
  using ( true );

create policy "Users can delete their own videos."
  on viral_moments for delete
  using ( true );
