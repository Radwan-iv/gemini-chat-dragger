-- Drop all existing policies to start fresh
drop policy if exists "Enable insert for all users" on search_history;
drop policy if exists "Enable read access for all users" on search_history;
drop policy if exists "Enable delete for own records" on search_history;

-- Make sure RLS is enabled
alter table search_history enable row level security;

-- Create a policy that allows both authenticated and anonymous users to insert
create policy "search_history_insert_policy"
on search_history for insert
to public
with check (
  -- For authenticated users, their user_id must match auth.uid()
  -- For anonymous users, they must use the anonymous UUID and not be authenticated
  (auth.uid()::text = user_id) or 
  (user_id = '00000000-0000-0000-0000-000000000000' and auth.uid() is null)
);

-- Allow all users to read search history
create policy "search_history_select_policy"
on search_history for select
to public
using (true);

-- Allow users to delete their own records (including anonymous)
create policy "search_history_delete_policy"
on search_history for delete
to public
using (
  user_id = coalesce(auth.uid()::text, '00000000-0000-0000-0000-000000000000')
);