-- First drop existing policies
drop policy if exists "Enable read access for all users" on search_history;
drop policy if exists "Enable insert for authenticated users" on search_history;
drop policy if exists "Enable insert for anonymous users" on search_history;
drop policy if exists "Enable delete for own records" on search_history;

-- Enable RLS
alter table search_history enable row level security;

-- Create a single insert policy that handles both authenticated and anonymous users
create policy "Enable insert for all users"
on search_history for insert
to public
with check (
  (auth.uid() = user_id) or 
  (user_id = '00000000-0000-0000-0000-000000000000' and auth.uid() is null)
);

-- Allow reading all records
create policy "Enable read access for all users"
on search_history for select
to public
using (true);

-- Allow users to delete their own records
create policy "Enable delete for own records"
on search_history for delete
to public
using (
  user_id = coalesce(auth.uid()::text, '00000000-0000-0000-0000-000000000000')
);