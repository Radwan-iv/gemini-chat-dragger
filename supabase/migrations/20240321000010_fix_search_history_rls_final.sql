-- First drop all existing policies
drop policy if exists "allow_all_operations" on search_history;
drop policy if exists "enable_anonymous_operations" on search_history;
drop policy if exists "allow_anonymous_access" on search_history;
drop policy if exists "enable_insert_for_all_users" on search_history;
drop policy if exists "enable_select_for_all_users" on search_history;
drop policy if exists "enable_delete_for_all_users" on search_history;

-- Disable RLS temporarily
alter table search_history disable row level security;

-- Re-enable RLS
alter table search_history enable row level security;

-- Create a simple policy for anonymous users
create policy "allow_anonymous_operations"
on search_history
for all
to public
using (user_id = '00000000-0000-0000-0000-000000000000')
with check (user_id = '00000000-0000-0000-0000-000000000000');

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all privileges on table search_history to anon, authenticated;
grant all privileges on sequence search_history_id_seq to anon, authenticated;