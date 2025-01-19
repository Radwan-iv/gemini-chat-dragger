-- First, drop any existing policies to start fresh
drop policy if exists "Users can insert their own search history" on "public"."search_history";
drop policy if exists "Anonymous users can insert search history" on "public"."search_history";
drop policy if exists "Users can read search history" on "public"."search_history";
drop policy if exists "Users can delete their own search history" on "public"."search_history";

-- Enable RLS on the search_history table
alter table "public"."search_history" enable row level security;

-- Create policy to allow authenticated users to insert their own records
create policy "Users can insert their own search history"
on "public"."search_history"
for insert
to authenticated
with check (auth.uid() = user_id);

-- Create policy to allow anonymous users to insert records
create policy "Anonymous users can insert search history"
on "public"."search_history"
for insert
to anon
with check (true);

-- Create policy to allow users to read records
create policy "Users can read search history"
on "public"."search_history"
for select
using (true);

-- Create policy to allow users to delete their own records
create policy "Users can delete their own search history"
on "public"."search_history"
for delete
using (
  auth.uid() = user_id 
  or 
  auth.uid() is null
);