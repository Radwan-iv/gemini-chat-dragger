-- First drop all existing policies
drop policy if exists "enable_global_insert" on search_history;
drop policy if exists "enable_global_select" on search_history;
drop policy if exists "enable_delete_own_records" on search_history;

-- Disable RLS temporarily to ensure we can reset everything
alter table search_history disable row level security;

-- Re-enable RLS
alter table search_history enable row level security;

-- Create a single policy that allows all operations for all users
create policy "allow_all_operations"
on search_history
for all
using (true)
with check (true);

-- Grant necessary permissions to the anon role
grant all on search_history to anon;
grant usage on schema public to anon;