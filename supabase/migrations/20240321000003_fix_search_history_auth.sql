-- Drop existing policies
drop policy if exists "search_history_insert_policy" on search_history;
drop policy if exists "search_history_select_policy" on search_history;
drop policy if exists "search_history_delete_policy" on search_history;

-- Make sure RLS is enabled
alter table search_history enable row level security;

-- Create a policy that allows both authenticated and anonymous users to insert
create policy "enable_global_insert"
on search_history for insert
to authenticated, anon
with check (true);

-- Allow all users to read search history
create policy "enable_global_select"
on search_history for select
to authenticated, anon
using (true);

-- Allow users to delete their own records
create policy "enable_delete_own_records"
on search_history for delete
to authenticated, anon
using (true);